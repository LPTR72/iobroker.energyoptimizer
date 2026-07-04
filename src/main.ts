import * as utils from "@iobroker/adapter-core";
import { EnergyOptimizerConfig, getPollingIntervalSeconds, toNumber } from "./lib/config";
import { ConfigurationNormalizer } from "./lib/ConfigurationNormalizer";
import { IoBrokerStateProvider } from "./lib/IoBrokerStateProvider";
import { IStateProvider, NumericLiveStateId } from "./lib/model";
import { StateManager } from "./lib/StateManager";
import { STATE_IDS } from "./lib/states";
import { TariffEngine } from "./lib/TariffEngine";

class EnergyOptimizer extends utils.Adapter {
    private pollTimer?: NodeJS.Timeout;
    private readonly stateManager: StateManager;
    private readonly stateProvider: IStateProvider;
    private readonly configurationNormalizer = new ConfigurationNormalizer();

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({ ...options, name: "energyoptimizer" });

        this.stateManager = new StateManager(this);
        this.stateProvider = new IoBrokerStateProvider(this);
        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    private async onReady(): Promise<void> {
        try {
            const config = this.config as EnergyOptimizerConfig;
            await this.stateManager.createStates();
            await this.stateManager.initializeRuntimeStates(config);
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

            await this.setStateAsync(STATE_IDS.info.connection, false, true);
            callback();
        } catch {
            callback();
        }
    }

    private startPolling(): void {
        const pollingIntervalSeconds = getPollingIntervalSeconds(this.config as EnergyOptimizerConfig);

        this.pollTimer = setInterval(() => {
            void this.pollSources().catch(error => {
                this.log.warn(`Polling failed: ${this.formatError(error)}`);
            });
        }, pollingIntervalSeconds * 1000);

        void this.pollSources().catch(error => {
            this.log.warn(`Initial polling failed: ${this.formatError(error)}`);
        });

        this.log.info(`Polling energy source states every ${pollingIntervalSeconds} seconds`);
    }

    private async pollSources(): Promise<void> {
        const pollingStartedAt = Date.now();
        const config = this.config as EnergyOptimizerConfig;
        const pollingIntervalSeconds = getPollingIntervalSeconds(config);
        const workPriceCt = toNumber(config.fixedWorkPriceCt, 0) ?? 0;

        const sourceIds = [
            config.sourceGridImportPower,
            config.sourceGridExportPower,
            config.sourceHouseConsumptionPower,
            config.sourcePvPower,
            config.sourceBatterySoc,
            config.sourceBatteryPower,
        ];

        const importPowerW = await this.mirrorSource(config.sourceGridImportPower, STATE_IDS.live.gridImportPower);
        const sourceValues = [
            importPowerW,
            await this.mirrorSource(config.sourceGridExportPower, STATE_IDS.live.gridExportPower),
            await this.mirrorSource(config.sourceHouseConsumptionPower, STATE_IDS.live.houseConsumptionPower),
            await this.mirrorSource(config.sourcePvPower, STATE_IDS.live.pvPower),
            await this.mirrorSource(config.sourceBatterySoc, STATE_IDS.live.batterySoc),
            await this.mirrorSource(config.sourceBatteryPower, STATE_IDS.live.batteryPower),
        ];

        const intervalKwh = TariffEngine.calculateIntervalKwh(importPowerW ?? 0, pollingIntervalSeconds);
        const intervalCostEuro = TariffEngine.calculateIntervalCostEuro(intervalKwh, workPriceCt);
        await this.stateManager.addCost(intervalCostEuro);

        const configuredSources = sourceIds.filter(sourceId => Boolean(sourceId?.trim())).length;
        const validSources = sourceValues.filter(value => value !== undefined).length;
        const normalizedAssets = this.configurationNormalizer.normalize(config);
        await this.stateManager.writeHealthStatus({
            configuredSources,
            validSources,
            missingSources: configuredSources - validSources,
            lastPollingTimestamp: pollingStartedAt,
            lastPollingDurationMs: Date.now() - pollingStartedAt,
            assetsCount: normalizedAssets.length,
            gridAssetsCount: normalizedAssets.filter(asset => asset.type === "grid").length,
            pvAssetsCount: normalizedAssets.filter(asset => asset.type === "pv").length,
            batteryAssetsCount: normalizedAssets.filter(asset => asset.type === "battery").length,
            consumerAssetsCount: normalizedAssets.filter(asset => asset.type === "consumer").length,
        });
    }

    private async mirrorSource(
        sourceId: string | undefined,
        targetId: NumericLiveStateId,
    ): Promise<number | undefined> {
        const value = await this.stateProvider.readNumericState(sourceId);
        if (value !== undefined) {
            await this.stateManager.writeMirroredLiveValue(targetId, value);
        }
        return value;
    }

    private formatError(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}

if (require.main !== module) {
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new EnergyOptimizer(options);
} else {
    (() => new EnergyOptimizer())();
}
