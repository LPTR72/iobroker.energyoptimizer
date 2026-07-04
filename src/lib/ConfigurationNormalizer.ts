import { EnergyOptimizerConfig } from "./config";
import { EnergyAssetConfig } from "./model";

export class ConfigurationNormalizer {
    public normalize(config: EnergyOptimizerConfig): readonly EnergyAssetConfig[] {
        const enabledAssets = (config.energyAssets ?? []).filter(asset => asset.enabled === true);
        const assets: EnergyAssetConfig[] = [...enabledAssets];
        const gridPowerStateId = this.normalizeStateId(config.sourceGridImportPower);
        const pvPowerStateId = this.normalizeStateId(config.sourcePvPower);
        const batteryPowerStateId = this.normalizeStateId(config.sourceBatteryPower);
        const batterySocStateId = this.normalizeStateId(config.sourceBatterySoc);
        const housePowerStateId = this.normalizeStateId(config.sourceHouseConsumptionPower);

        if (!enabledAssets.some(asset => asset.type === "grid") && gridPowerStateId) {
            assets.push({
                enabled: true,
                id: "grid",
                name: "Grid",
                type: "grid",
                powerStateId: gridPowerStateId,
            });
        }

        if (!enabledAssets.some(asset => asset.type === "pv") && pvPowerStateId) {
            assets.push({
                enabled: true,
                id: "pv.default",
                name: "Default PV system",
                type: "pv",
                powerStateId: pvPowerStateId,
            });
        }

        if (
            !enabledAssets.some(asset => asset.type === "battery") &&
            (batteryPowerStateId || batterySocStateId)
        ) {
            assets.push({
                enabled: true,
                id: "battery.default",
                name: "Default battery",
                type: "battery",
                powerStateId: batteryPowerStateId,
                socStateId: batterySocStateId,
            });
        }

        if (!enabledAssets.some(asset => asset.type === "consumer") && housePowerStateId) {
            assets.push({
                enabled: true,
                id: "house",
                name: "House",
                type: "consumer",
                powerStateId: housePowerStateId,
            });
        }

        return assets;
    }

    private normalizeStateId(stateId: string | undefined): string | undefined {
        const normalizedStateId = stateId?.trim();
        return normalizedStateId || undefined;
    }
}
