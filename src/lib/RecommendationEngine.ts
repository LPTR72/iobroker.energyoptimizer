import type {
    EnergySituation,
    OptimizationConstraint,
    OptimizationGoal,
    OptimizationGoalType,
    Recommendation,
    RecommendationPriority,
    RecommendationReasonCode,
    RecommendationType,
} from "./optimization";
import type { PredictionHorizon } from "./prediction";
import type { RecommendationOptions } from "./recommendation";

export const DEFAULT_RECOMMENDATION_OPTIONS: Readonly<RecommendationOptions> = {
    minimumGoalPriority: 1,
};

interface RecommendationCandidate {
    readonly recommendation: Recommendation;
    readonly rank: number;
    readonly goalPriority: number;
}

export class RecommendationEngine {
    private readonly options: Readonly<RecommendationOptions>;

    public constructor(options: RecommendationOptions = DEFAULT_RECOMMENDATION_OPTIONS) {
        this.validateOptions(options);
        this.options = { ...options };
    }

    public recommend(
        situations: readonly EnergySituation[],
        goals: readonly OptimizationGoal[],
        constraints: readonly OptimizationConstraint[],
    ): readonly Recommendation[] {
        const relevantGoals = goals.filter(
            goal =>
                goal.enabled &&
                Number.isFinite(goal.priority) &&
                goal.priority >= this.options.minimumGoalPriority,
        );
        if (situations.length === 0 || relevantGoals.length === 0 || this.hasGlobalManualOverride(constraints)) {
            return [];
        }

        const candidates: RecommendationCandidate[] = [];
        for (const situation of situations) {
            for (const goal of relevantGoals) {
                const type = this.recommendationType(situation.type, goal.type);
                if (!type) {
                    continue;
                }

                const recommendation = this.createRecommendation(type, situation, goal.priority);
                if (this.isAllowed(recommendation, constraints)) {
                    candidates.push({
                        recommendation,
                        rank: this.priorityRank(recommendation.priority),
                        goalPriority: goal.priority,
                    });
                }
            }
        }

        candidates.sort(
            (left, right) =>
                right.rank - left.rank ||
                right.goalPriority - left.goalPriority ||
                left.recommendation.horizon.from - right.recommendation.horizon.from ||
                left.recommendation.horizon.to - right.recommendation.horizon.to ||
                this.compareText(left.recommendation.type, right.recommendation.type) ||
                this.compareText(left.recommendation.reason.description, right.recommendation.reason.description) ||
                this.compareText(
                    left.recommendation.targetAssetIds?.join(",") ?? "",
                    right.recommendation.targetAssetIds?.join(",") ?? "",
                ),
        );

        const seen = new Set<string>();
        return candidates
            .filter(candidate => {
                const recommendation = candidate.recommendation;
                const key = `${recommendation.type}:${recommendation.horizon.from}:${recommendation.horizon.to}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            })
            .map(candidate => candidate.recommendation);
    }

    private recommendationType(
        situationType: EnergySituation["type"],
        goalType: OptimizationGoalType,
    ): RecommendationType | undefined {
        switch (situationType) {
            case "pv_surplus":
                if (goalType === "maximize_self_consumption") return "increase_self_consumption";
                if (goalType === "avoid_feed_in" || goalType === "respect_feed_in_limit") return "avoid_feed_in";
                return undefined;
            case "grid_import":
                if (goalType === "minimize_grid_import" || goalType === "minimize_cost") {
                    return "reduce_grid_import";
                }
                return undefined;
            case "grid_export":
                return goalType === "avoid_feed_in" || goalType === "respect_feed_in_limit"
                    ? "avoid_feed_in"
                    : undefined;
            case "battery_low":
                return goalType === "protect_battery" ? "protect_storage" : undefined;
            case "battery_high":
            case "battery_full_soon":
                return goalType === "maximize_self_consumption" ? "increase_self_consumption" : undefined;
            case "high_price_period":
            case "cheap_price_period":
                return goalType === "minimize_cost" ? "prepare_for_price_window" : undefined;
            case "forecast_uncertain":
                return undefined;
        }
    }

    private createRecommendation(
        type: RecommendationType,
        situation: EnergySituation,
        goalPriority: number,
    ): Recommendation {
        const priority = this.recommendationPriority(goalPriority, situation.severity);
        return {
            type,
            priority,
            horizon: { ...situation.horizon },
            reason: {
                code: this.reasonCode(situation.type),
                description: situation.message ?? `Respond to ${situation.type}.`,
            },
            relatedSituationTypes: [situation.type],
            ...(situation.relatedAssetIds ? { targetAssetIds: [...situation.relatedAssetIds] } : {}),
        };
    }

    private reasonCode(situationType: EnergySituation["type"]): RecommendationReasonCode {
        switch (situationType) {
            case "pv_surplus":
                return "pv_surplus";
            case "grid_import":
                return "grid_import";
            case "grid_export":
                return "grid_export";
            case "battery_low":
                return "low_storage_level";
            case "battery_high":
            case "battery_full_soon":
                return "high_storage_level";
            case "high_price_period":
            case "cheap_price_period":
                return "price_window";
            case "forecast_uncertain":
                return "forecast";
        }
    }

    private recommendationPriority(
        goalPriority: number,
        situationSeverity: EnergySituation["severity"],
    ): RecommendationPriority {
        const severityWeight = situationSeverity === "critical" ? 20 : situationSeverity === "warning" ? 10 : 0;
        const score = Math.max(0, Math.min(100, goalPriority)) + severityWeight;
        if (score >= 90) return "critical";
        if (score >= 70) return "high";
        if (score >= 40) return "medium";
        return "low";
    }

    private priorityRank(priority: RecommendationPriority): number {
        return { low: 1, medium: 2, high: 3, critical: 4 }[priority];
    }

    private hasGlobalManualOverride(constraints: readonly OptimizationConstraint[]): boolean {
        return constraints.some(constraint => constraint.enabled && constraint.type === "manual_override" && !constraint.assetId);
    }

    private isAllowed(
        recommendation: Recommendation,
        constraints: readonly OptimizationConstraint[],
    ): boolean {
        for (const constraint of constraints) {
            if (!constraint.enabled) continue;
            if (
                constraint.type === "manual_override" &&
                constraint.assetId &&
                recommendation.targetAssetIds?.includes(constraint.assetId)
            ) {
                return false;
            }
            if (
                constraint.type === "time_window" &&
                constraint.horizon &&
                !this.overlaps(recommendation.horizon, constraint.horizon)
            ) {
                return false;
            }
            if (
                constraint.type === "avoid_battery_cycling" &&
                (recommendation.type === "charge_storage" || recommendation.type === "discharge_storage")
            ) {
                return false;
            }
        }
        return true;
    }

    private overlaps(left: Readonly<PredictionHorizon>, right: Readonly<PredictionHorizon>): boolean {
        if (left.from === left.to) {
            return left.from >= right.from && left.from < right.to;
        }
        return left.from < right.to && right.from < left.to;
    }

    private compareText(left: string, right: string): number {
        return left < right ? -1 : left > right ? 1 : 0;
    }

    private validateOptions(options: RecommendationOptions): void {
        if (!Number.isFinite(options.minimumGoalPriority) || options.minimumGoalPriority < 0) {
            throw new RangeError("minimumGoalPriority must be a finite, non-negative number.");
        }
    }
}
