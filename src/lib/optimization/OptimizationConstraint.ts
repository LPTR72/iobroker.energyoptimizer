import type { PredictionHorizon } from "../prediction";
import type { OptimizationCapabilityType } from "./OptimizationCapability";

export type OptimizationConstraintType =
    | "time_window"
    | "power_limit"
    | "energy_limit"
    | "duration_limit"
    | "state_of_charge_limit"
    | "required_capability"
    | "avoid_battery_cycling"
    | "manual_override";

export interface OptimizationConstraint {
    readonly type: OptimizationConstraintType;
    readonly enabled: boolean;
    readonly assetId?: string;
    readonly horizon?: Readonly<PredictionHorizon>;
    readonly minPowerW?: number;
    readonly maxPowerW?: number;
    readonly minEnergyWh?: number;
    readonly maxEnergyWh?: number;
    readonly minDurationMinutes?: number;
    readonly maxDurationMinutes?: number;
    readonly minStateOfChargePercent?: number;
    readonly maxStateOfChargePercent?: number;
    readonly requiredCapability?: OptimizationCapabilityType;
    readonly reason?: string;
}
