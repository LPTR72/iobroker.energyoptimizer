import type { ExecutionAction } from "./ExecutionAction";
import type { RecommendationType } from "./Recommendation";
import type { RecommendationReason } from "./RecommendationReason";

export type ExecutionPlanStatus = "dormant" | "ready" | "partial" | "blocked" | "noop";

export interface ExecutionPlan {
    readonly id: string;
    readonly generatedAt: number;
    readonly validUntil?: number;
    readonly status: ExecutionPlanStatus;
    readonly sourceRecommendationType?: RecommendationType;
    readonly reason?: Readonly<RecommendationReason>;
    readonly actions: readonly ExecutionAction[];
    readonly warnings: readonly string[];
}
