export type ExecutionActionType =
    | "set_battery_charge_power"
    | "set_battery_discharge_power"
    | "switch_load_on"
    | "switch_load_off"
    | "set_feed_in_limit"
    | "schedule_load_start"
    | "noop";

export type ExecutionPlanStatus = "ready" | "partial" | "blocked" | "noop";

export interface ExecutionAction {
    type: ExecutionActionType;
    targetAssetId?: string;
    powerW?: number;
    durationMinutes?: number;
    scheduledStart?: number;
    reason?: string;
}

export interface ExecutionPlan {
    generatedAt: number;
    status: ExecutionPlanStatus;
    actions: readonly ExecutionAction[];
    warnings: readonly string[];
}
