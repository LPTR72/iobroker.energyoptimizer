import { EnergyOptimizerConfig, toNumber } from "./config";
import { ConfigurationNormalizer } from "./ConfigurationNormalizer";
import { EnergySystemFactory } from "./EnergySystemFactory";
import { IStateProvider, OptimizationGoals, OptimizerInput, TariffConfig } from "./model";

export class OptimizerInputFactory {
    private readonly energySystemFactory: EnergySystemFactory;

    public constructor(stateProvider: IStateProvider) {
        this.energySystemFactory = new EnergySystemFactory(stateProvider);
    }

    public async create(config: EnergyOptimizerConfig): Promise<OptimizerInput> {
        const assetConfigs = new ConfigurationNormalizer().normalize(config);
        const system = await this.energySystemFactory.create({
            ...config,
            energyAssets: assetConfigs,
        });
        const tariff: TariffConfig = {
            workPriceCt: toNumber(config.fixedWorkPriceCt, 0) ?? 0,
            basePriceMonthlyEuro: toNumber(config.fixedBasePriceMonthlyEuro, 0) ?? 0,
        };
        const goals: OptimizationGoals = {
            maximizeSelfConsumption: true,
            minimizeGridCosts: true,
            preserveBatteryForEvening: false,
            emergencyReservePercent: 20,
            minimizeBatteryCycles: true,
            gridOptimization: {
                mode: "zeroExport",
                targetGridImportW: 30,
                allowedExportW: 0,
                deadbandW: 50,
            },
        };

        return {
            system,
            tariff,
            goals,
        };
    }
}
