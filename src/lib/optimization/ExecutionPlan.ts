import type { ExecutionAction } from "./ExecutionAction";

export type ExecutionPlanStatus = "ready" | "partial" | "blocked" | "noop";

export interface ExecutionPlan {
    readonly generatedAt: number;
    readonly status: ExecutionPlanStatus;
    readonly actions: readonly ExecutionAction[];
    readonly warnings: readonly string[];
}
