import { EnergyAssetType } from "./model";

export interface PowerBalance {
    totalConsumptionW: number;
    totalPvProductionW: number;
    totalBatteryChargePowerW: number;
    totalBatteryDischargePowerW: number;
    surplusW: number;
    deficitW: number;
    selfConsumptionW: number;
    selfSufficiencyPercent: number;
    pvUsagePercent: number;
}

export interface GridAnalysis {
    gridImportW: number;
    gridExportW: number;
}

export interface PvAnalysis {
    totalPvProductionW: number;
    pvUsagePercent: number;
}

export interface BatteryAnalysis {
    totalBatteryChargePowerW: number;
    totalBatteryDischargePowerW: number;
    batterySocPercentAverage: number;
}

export interface AssetAnalysis {
    id: string;
    type: EnergyAssetType;
    available: boolean;
}

export interface EnergyAnalysis extends PowerBalance, GridAnalysis, PvAnalysis, BatteryAnalysis {
    timestamp: number;
    assetHealth: readonly AssetAnalysis[];
}
