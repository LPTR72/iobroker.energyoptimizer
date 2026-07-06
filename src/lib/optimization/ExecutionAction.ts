import type { PredictionHorizon } from "../prediction";

export type ExecutionActionType =
    | "charge_storage"
    | "discharge_storage"
    | "switch_consumer_on"
    | "switch_consumer_off"
    | "limit_feed_in"
    | "schedule_consumer";

export interface ExecutionActionLimits {
    readonly minPowerW?: number;
    readonly maxPowerW?: number;
    readonly powerStepW?: number;
    readonly minEnergyWh?: number;
    readonly maxEnergyWh?: number;
    readonly minDurationMinutes?: number;
    readonly maxDurationMinutes?: number;
    readonly minStateOfChargePercent?: number;
    readonly maxStateOfChargePercent?: number;
}

export interface ExecutionAction {
    readonly type: ExecutionActionType;
    readonly targetAssetId: string;
    readonly horizon?: Readonly<PredictionHorizon>;
    readonly powerW?: number;
    readonly energyWh?: number;
    readonly durationMinutes?: number;
    readonly limits?: Readonly<ExecutionActionLimits>;
    readonly reason?: string;
}
