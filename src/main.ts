import * as utils from "@iobroker/adapter-core";

interface EnergyOptimizerConfig {
    fixedWorkPriceCt?: number | string;
    fixedBasePriceMonthlyEuro?: number | string;
    sourceGridImportPower?: string;
    sourceGridExportPower?: string;
    sourceHouseConsumptionPower?: string;
    sourcePvPower?: string;
    sourceBatterySoc?: string;
    sourceBatteryPower?: string;
    pollingIntervalSeconds?: number | string;
}

type NumericStateId =
    | "config.currentTariff.workPriceCt"
    | "config.currentTariff.basePriceMonthlyEuro"
    | "live.grid.importPower"
    | "live.grid.exportPower"
    | "live.house.consumptionPower"
    | "live.pv.power"
    | "live.battery.soc"
    | "live.battery.power"
    | "costs.today.currentTariffEuro"
    | "costs.month.currentTariffEuro";

type BooleanStateId = "info.connection" | "simulation.ready";
type StringStateId = "optimizer.recommendation";

interface NumericStateDefinition {
    id: NumericStateId;
    name: string;
    role: string;
    unit?: string;
    read?: boolean;
    write?: boolean;
}

class EnergyOptimizer extends utils.Adapter {
    private pollTimer?: NodeJS.Timeout;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "energyoptimizer",
        });

        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    private async onReady(): Promise<void> {
        try {
            await this.createStates();
            await this.initializeRuntimeStates();
            this.startPolling();
        } catch (error) {
            this.log.error(`Initialization failed: ${this.formatError(error)}`);
        }
    }

    private async onUnload(callback: () => void): Promise<void> {
        try {
            if (this.pollTimer) {
                clearInterval(this.pollTimer);
                this.pollTimer = undefined;
            }

            await this.setStateAsync("info.connection", false, true);
            callback();
        } catch {
            callback();
        }
    }

    private async createStates(): Promise<void> {
        const numericStates: NumericStateDefinition[] = [
            {
                id: "config.currentTariff.workPriceCt",
                name: "Current fixed work price",
                role: "value.price",
                unit: "ct/kWh",
            },
            {
                id: "config.currentTariff.basePriceMonthlyEuro",
                name: "Current fixed monthly base price",
                role: "value.price",
                unit: "EUR",
            },
            {
                id: "live.grid.importPower",
                name: "Live grid import power",
                role: "value.power.consumption",
                unit: "W",
            },
            {
                id: "live.grid.exportPower",
                name: "Live grid export power",
                role: "value.power.feed",
                unit: "W",
            },
            {
                id: "live.house.consumptionPower",
                name: "Live house consumption power",
                role: "value.power.consumption",
                unit: "W",
            },
            {
                id: "live.pv.power",
                name: "Live PV power",
                role: "value.power",
                unit: "W",
            },
            {
                id: "live.battery.soc",
                name: "Live battery state of charge",
                role: "value.battery",
                unit: "%",
            },
            {
                id: "live.battery.power",
                name: "Live battery power",
                role: "value.power",
                unit: "W",
            },
            {
                id: "costs.today.currentTariffEuro",
                name: "Current tariff costs today",
                role: "value.price",
                unit: "EUR",
            },
            {
                id: "costs.month.currentTariffEuro",
                name: "Current tariff costs this month",
                role: "value.price",
                unit: "EUR",
            },
        ];

        for (const state of numericStates) {
            await this.setObjectNotExistsAsync(state.id, {
                type: "state",
                common: {
                    name: state.name,
                    type: "number",
                    role: state.role,
                    read: state.read ?? true,
                    write: state.write ?? false,
                    unit: state.unit,
                    def: 0,
                },
                native: {},
            });
        }

        await this.createBooleanState("info.connection", "Adapter connection state", "indicator.connected", false);
        await this.createBooleanState("simulation.ready", "Simulation data readiness", "indicator", false);
        await this.createStringState("optimizer.recommendation", "Optimizer recommendation", "text", "");
    }

    private async createBooleanState(id: BooleanStateId, name: string, role: string, def: boolean): Promise<void> {
        await this.setObjectNotExistsAsync(id, {
            type: "state",
            common: {
                name,
                type: "boolean",
                role,
                read: true,
                write: false,
                def,
            },
            native: {},
        });
    }

    private async createStringState(id: StringStateId, name: string, role: string, def: string): Promise<void> {
        await this.setObjectNotExistsAsync(id, {
            type: "state",
            common: {
                name,
                type: "string",
                role,
                read: true,
                write: false,
                def,
            },
            native: {},
        });
    }

    private async initializeRuntimeStates(): Promise<void> {
        const config = this.config as EnergyOptimizerConfig;
        const workPriceCt = this.toNumber(config.fixedWorkPriceCt, 0);
        const basePriceMonthlyEuro = this.toNumber(config.fixedBasePriceMonthlyEuro, 0);

        await this.setStateAsync("info.connection", true, true);
        await this.setStateAsync("simulation.ready", false, true);
        await this.setStateAsync("optimizer.recommendation", "collecting data", true);
        await this.setStateAsync("config.currentTariff.workPriceCt", workPriceCt, true);
        await this.setStateAsync("config.currentTariff.basePriceMonthlyEuro", basePriceMonthlyEuro, true);
    }

    private startPolling(): void {
        const pollingIntervalSeconds = this.getPollingIntervalSeconds();
        const pollingIntervalMs = pollingIntervalSeconds * 1000;

        this.pollTimer = setInterval(() => {
            void this.pollSources().catch(error => {
                this.log.warn(`Polling failed: ${this.formatError(error)}`);
            });
        }, pollingIntervalMs);

        void this.pollSources().catch(error => {
            this.log.warn(`Initial polling failed: ${this.formatError(error)}`);
        });

        this.log.info(`Polling energy source states every ${pollingIntervalSeconds} seconds`);
    }

    private async pollSources(): Promise<void> {
        const config = this.config as EnergyOptimizerConfig;
        const pollingIntervalSeconds = this.getPollingIntervalSeconds();
        const workPriceCt = this.toNumber(config.fixedWorkPriceCt, 0);

        const importPowerW = await this.mirrorNumericSource(config.sourceGridImportPower, "live.grid.importPower");
        await this.mirrorNumericSource(config.sourceGridExportPower, "live.grid.exportPower");
        await this.mirrorNumericSource(config.sourceHouseConsumptionPower, "live.house.consumptionPower");
        await this.mirrorNumericSource(config.sourcePvPower, "live.pv.power");
        await this.mirrorNumericSource(config.sourceBatterySoc, "live.battery.soc");
        await this.mirrorNumericSource(config.sourceBatteryPower, "live.battery.power");

        const safeImportPowerW = Math.max(importPowerW ?? 0, 0);
        const importedKwh = (safeImportPowerW / 1000) * (pollingIntervalSeconds / 3600);
        const intervalCostEuro = importedKwh * (workPriceCt / 100);

        await this.addToState("costs.today.currentTariffEuro", intervalCostEuro);
        await this.addToState("costs.month.currentTariffEuro", intervalCostEuro);
    }

    private async mirrorNumericSource(sourceId: string | undefined, targetId: NumericStateId): Promise<number | undefined> {
        const normalizedSourceId = sourceId?.trim();

        if (!normalizedSourceId) {
            return undefined;
        }

        try {
            const sourceState = await this.getForeignStateAsync(normalizedSourceId);

            if (!sourceState || sourceState.val === null || sourceState.val === undefined) {
                this.log.debug(`Source state "${normalizedSourceId}" has no value`);
                return undefined;
            }

            const value = this.toNumber(sourceState.val);

            if (value === undefined) {
                this.log.warn(`Source state "${normalizedSourceId}" is not numeric: ${String(sourceState.val)}`);
                return undefined;
            }

            await this.setStateAsync(targetId, value, true);
            return value;
        } catch (error) {
            this.log.warn(`Could not read source state "${normalizedSourceId}": ${this.formatError(error)}`);
            return undefined;
        }
    }

    private async addToState(stateId: NumericStateId, valueToAdd: number): Promise<void> {
        if (!Number.isFinite(valueToAdd) || valueToAdd <= 0) {
            return;
        }

        const currentState = await this.getStateAsync(stateId);
        const currentValue = this.toNumber(currentState?.val, 0) ?? 0;
        const nextValue = currentValue + valueToAdd;

        await this.setStateAsync(stateId, Number(nextValue.toFixed(6)), true);
    }

    private getPollingIntervalSeconds(): number {
        const config = this.config as EnergyOptimizerConfig;
        const configuredValue = this.toNumber(config.pollingIntervalSeconds, 60);
        return Math.max(1, Math.round(configuredValue ?? 60));
    }

    private toNumber(value: ioBroker.StateValue | number | string | undefined, fallback?: number): number | undefined {
        if (value === null || value === undefined || value === "") {
            return fallback;
        }

        const numericValue = typeof value === "number" ? value : Number(value);

        if (!Number.isFinite(numericValue)) {
            return fallback;
        }

        return numericValue;
    }

    private formatError(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        return String(error);
    }
}

if (require.main !== module) {
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new EnergyOptimizer(options);
} else {
    (() => new EnergyOptimizer())();
}
