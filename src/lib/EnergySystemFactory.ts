import { EnergyOptimizerConfig } from "./config";
import {
    BatteryState,
    EnergyAsset,
    EnergyAssetCapability,
    EnergyAssetConfig,
    EnergyAssetType,
    EnergySystemState,
    IStateProvider,
    PvState,
} from "./model";

export class EnergySystemFactory {
    public constructor(private readonly stateProvider: IStateProvider) {}

    public async create(config: EnergyOptimizerConfig): Promise<EnergySystemState> {
        const legacyState = await this.createLegacyState(config);
        const enabledAssetConfigs = (config.energyAssets ?? []).filter(asset => asset.enabled === true);

        if (enabledAssetConfigs.length === 0) {
            return legacyState;
        }

        const assets = await Promise.all(enabledAssetConfigs.map(asset => this.createAsset(asset)));
        const pvAssets = assets.filter(asset => asset.type === "pv");
        const batteryAssets = assets.filter(asset => asset.type === "battery");
        const consumerAsset = assets.find(asset => asset.type === "consumer");
        const gridConfigIndex = enabledAssetConfigs.findIndex(
            asset => asset.type === "grid" && Boolean(asset.powerStateId?.trim()),
        );
        const gridAsset = gridConfigIndex >= 0 ? assets[gridConfigIndex] : undefined;

        const pvSystems: readonly PvState[] = pvAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            productionPowerW: asset.currentPowerW,
        }));
        const batteries: readonly BatteryState[] = batteryAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            socPercent: asset.socPercent,
            powerW: asset.currentPowerW,
            capacityWh: asset.capacityWh,
        }));
        const pv: PvState = {
            id: "aggregated",
            name: "Aggregated PV",
            productionPowerW: pvAssets.reduce((sum, asset) => sum + (asset.currentPowerW ?? 0), 0),
        };

        return {
            grid: {
                importPowerW: gridAsset?.currentPowerW ?? legacyState.grid.importPowerW,
                exportPowerW: legacyState.grid.exportPowerW,
            },
            pv,
            pvSystems,
            battery: batteries[0] ?? legacyState.battery,
            batteries,
            house: consumerAsset
                ? { consumptionPowerW: consumerAsset.currentPowerW }
                : legacyState.house,
            assets,
        };
    }

    private async createAsset(config: EnergyAssetConfig): Promise<EnergyAsset> {
        const [currentPowerW, socPercent] = await Promise.all([
            this.stateProvider.readNumericState(config.powerStateId),
            this.stateProvider.readNumericState(config.socStateId),
        ]);

        return {
            id: config.id,
            type: config.type,
            name: config.name,
            manufacturer: config.manufacturer,
            model: config.model,
            currentPowerW,
            capacityWh: config.capacityWh,
            socPercent,
            capabilities: this.getCapabilities(config.type),
        };
    }

    private async createLegacyState(config: EnergyOptimizerConfig): Promise<EnergySystemState> {
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
                capabilities: this.getCapabilities("grid"),
            },
            {
                id: "pv.default",
                type: "pv",
                name: pv.name,
                currentPowerW: pv.productionPowerW,
                capabilities: this.getCapabilities("pv"),
            },
            {
                id: "battery.default",
                type: "battery",
                name: battery.name,
                currentPowerW: battery.powerW,
                capacityWh: battery.capacityWh,
                socPercent: battery.socPercent,
                capabilities: this.getCapabilities("battery"),
            },
            {
                id: "house",
                type: "consumer",
                name: "House",
                currentPowerW: consumptionPowerW,
                capabilities: this.getCapabilities("consumer"),
            },
        ];

        return {
            grid: { importPowerW, exportPowerW },
            pv,
            pvSystems: [pv],
            battery,
            batteries: [battery],
            house: { consumptionPowerW },
            assets,
        };
    }

    private getCapabilities(type: EnergyAssetType): readonly EnergyAssetCapability[] {
        switch (type) {
            case "pv":
            case "generator":
                return ["measurePower", "forecastProduction"];
            case "battery":
                return ["measurePower", "storeEnergy", "charge", "discharge"];
            case "consumer":
            case "evCharger":
            case "heatPump":
            case "boiler":
                return ["measurePower", "forecastConsumption"];
            default:
                return ["measurePower"];
        }
    }
}
