import { PredictionHorizon } from "./prediction";

export type EnergyConstraintType =
    | "max_feed_in_power"
    | "min_battery_soc"
    | "max_battery_soc"
    | "avoid_battery_cycling"
    | "quiet_hours"
    | "manual_override";

export interface EnergyConstraint {
    type: EnergyConstraintType;
    enabled: boolean;
    value?: number;
    horizon?: PredictionHorizon;
    reason?: string;
}
