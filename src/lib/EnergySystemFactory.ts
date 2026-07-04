import { EnergyOptimizerConfig } from "./config";
import { BatteryState, EnergyAsset, EnergySystemState, IStateProvider, PvState } from "./model";

export class EnergySystemFactory {
    public constructor(private readonly stateProvider: IStateProvider) {}

    public async create(config: EnergyOptimizerConfig): Promise<EnergySystemState> {
        const [importPowerW, exportPowerW, productionPowerW, socPercent, powerW, consumptionPowerW] =
            await Promise.all([
                this.stateProvider.readNumericState(config.sourceGridImportPower),
                this.stateProvider.readNumericState(config.sourceGridExportPower),
                this.stateProvider.readNumericState(config.sourcePvPower),
                this.stateProvider.readNumericState(config.sourceBatterySoc),
                this.stateProvider.readNumericState(config.sourceBatteryPower),
                this.stateProvider.readNumericState(config.sourceHouseConsumptionPower),
            ]);

        const battery: BatteryState = {
            id: "default",
            name: "Default battery",
            socPercent,
            powerW,
        };
        const pv: PvState = {
            id: "default",
            name: "Default PV system",
            productionPowerW,
        };
        const assets: readonly EnergyAsset[] = [
            {
                id: "grid",
                type: "grid",
                name: "Grid",
                currentPowerW: importPowerW,
                capabilities: ["measurePower"],
            },
            {
                id: "pv.default",
                type: "pv",
                name: pv.name,
                currentPowerW: pv.productionPowerW,
                capabilities: ["measurePower", "forecastProduction"],
            },
            {
                id: "battery.default",
                type: "battery",
                name: battery.name,
                currentPowerW: battery.powerW,
                capacityWh: battery.capacityWh,
                socPercent: battery.socPercent,
                capabilities: ["measurePower", "storeEnergy", "charge", "discharge"],
            },
            {
                id: "house",
                type: "consumer",
                name: "House",
                currentPowerW: consumptionPowerW,
                capabilities: ["measurePower", "forecastConsumption"],
            },
        ];

        return {
            grid: {
                importPowerW,
                exportPowerW,
            },
            pv,
            pvSystems: [pv],
            battery,
            batteries: [battery],
            house: {
                consumptionPowerW,
            },
            assets,
        };
    }
}
