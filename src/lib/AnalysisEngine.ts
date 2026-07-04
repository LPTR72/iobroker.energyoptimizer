import { AssetAnalysis, EnergyAnalysis } from "./analysis";
import { EnergyAsset, EnergySystemState } from "./model";

const CONSUMER_TYPES = new Set(["consumer", "evCharger", "heatPump", "boiler"]);

export class AnalysisEngine {
    public analyze(systemState: EnergySystemState): EnergyAnalysis {
        const pvAssets = systemState.assets.filter(asset => asset.type === "pv");
        const batteryAssets = systemState.assets.filter(asset => asset.type === "battery");
        const consumerAssets = systemState.assets.filter(asset => CONSUMER_TYPES.has(asset.type));

        const totalPvProductionW = pvAssets.reduce(
            (total, asset) => total + this.toNonNegativeNumber(asset.currentPowerW),
            0,
        );
        const totalConsumptionW = consumerAssets.length
            ? consumerAssets.reduce((total, asset) => total + this.toNonNegativeNumber(asset.currentPowerW), 0)
            : this.toNonNegativeNumber(systemState.house.consumptionPowerW);

        const batteryPowers = batteryAssets.map(asset => this.toNumber(asset.currentPowerW));
        const totalBatteryChargePowerW = batteryPowers.reduce((total, power) => total + Math.max(0, power), 0);
        const totalBatteryDischargePowerW = batteryPowers.reduce((total, power) => total + Math.max(0, -power), 0);
        const batterySocValues = batteryAssets
            .map(asset => asset.socPercent)
            .filter((value): value is number => value !== undefined && Number.isFinite(value));
        const batterySocPercentAverage = batterySocValues.length
            ? batterySocValues.reduce((total, value) => total + value, 0) / batterySocValues.length
            : 0;

        const gridImportW = this.toNonNegativeNumber(systemState.grid.importPowerW);
        const gridExportW = this.toNonNegativeNumber(systemState.grid.exportPowerW);
        const surplusW = Math.max(0, totalPvProductionW - totalConsumptionW);
        const deficitW = Math.max(0, totalConsumptionW - totalPvProductionW);
        const selfConsumptionW = Math.min(totalPvProductionW, totalConsumptionW);

        return {
            timestamp: Date.now(),
            totalConsumptionW,
            totalPvProductionW,
            totalBatteryChargePowerW,
            totalBatteryDischargePowerW,
            gridImportW,
            gridExportW,
            surplusW,
            deficitW,
            selfConsumptionW,
            selfSufficiencyPercent: this.percentage(selfConsumptionW, totalConsumptionW),
            pvUsagePercent: this.percentage(selfConsumptionW, totalPvProductionW),
            batterySocPercentAverage,
            assetHealth: systemState.assets.map(asset => this.analyzeAsset(asset)),
        };
    }

    private analyzeAsset(asset: EnergyAsset): AssetAnalysis {
        return {
            id: asset.id,
            type: asset.type,
            available: [asset.currentPowerW, asset.socPercent, asset.capacityWh].some(
                value => value !== undefined && Number.isFinite(value),
            ),
        };
    }

    private percentage(value: number, total: number): number {
        return total > 0 ? (value / total) * 100 : 0;
    }

    private toNonNegativeNumber(value: number | undefined): number {
        return Math.max(0, this.toNumber(value));
    }

    private toNumber(value: number | undefined): number {
        return value !== undefined && Number.isFinite(value) ? value : 0;
    }
}
