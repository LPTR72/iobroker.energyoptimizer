export type OptimizationGoalType =
    | "maximize_self_consumption"
    | "minimize_grid_import"
    | "minimize_cost"
    | "avoid_feed_in"
    | "protect_battery"
    | "prefer_comfort"
    | "respect_feed_in_limit";

export type OptimizationGoalPriority = number;

export interface OptimizationGoal {
    readonly type: OptimizationGoalType;
    readonly priority: OptimizationGoalPriority;
    readonly enabled: boolean;
    readonly description?: string;
}
