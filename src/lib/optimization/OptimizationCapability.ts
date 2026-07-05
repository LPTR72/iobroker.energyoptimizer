export type OptimizationCapabilityType =
    | "charge_storage"
    | "discharge_storage"
    | "switch_consumer"
    | "shift_consumer"
    | "limit_feed_in"
    | "read_only";

export interface OptimizationCapability {
    readonly assetId: string;
    readonly type: OptimizationCapabilityType;
    readonly minPowerW?: number;
    readonly maxPowerW?: number;
    readonly powerStepW?: number;
    readonly maxEnergyWh?: number;
    readonly minDurationMinutes?: number;
    readonly maxDurationMinutes?: number;
    readonly minStateOfChargePercent?: number;
    readonly maxStateOfChargePercent?: number;
}
