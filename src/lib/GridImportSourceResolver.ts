import type { EnergyOptimizerConfig } from "./config";

export class GridImportSourceResolver {
    public resolve(config: EnergyOptimizerConfig): string | undefined {
        const legacySourceId = this.normalizeStateId(config.sourceGridImportPower);
        if (legacySourceId) {
            return legacySourceId;
        }

        for (const asset of config.energyAssets ?? []) {
            if (asset.enabled !== true || asset.type !== "grid") {
                continue;
            }

            const assetSourceId = this.normalizeStateId(asset.powerStateId);
            if (assetSourceId) {
                return assetSourceId;
            }
        }

        return undefined;
    }

    private normalizeStateId(stateId: string | undefined): string | undefined {
        const normalizedStateId = stateId?.trim();
        return normalizedStateId || undefined;
    }
}
