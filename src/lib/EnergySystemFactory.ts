import { EnergyOptimizerConfig } from "./config";
import { EnergySystemState, IStateProvider } from "./model";

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

        return {
            grid: {
                importPowerW,
                exportPowerW,
            },
            pv: {
                productionPowerW,
            },
            battery: {
                socPercent,
                powerW,
            },
            house: {
                consumptionPowerW,
            },
        };
    }
}
