export type OptimizationGoalType =
    | "maximize_self_consumption"
    | "minimize_grid_import"
    | "minimize_cost"
    | "protect_battery"
    | "prefer_comfort"
    | "respect_feed_in_limit";

export type OptimizationGoalPriority = number;

export interface OptimizationGoal {
    type: OptimizationGoalType;
    priority: OptimizationGoalPriority;
    enabled: boolean;
    description?: string;
}
