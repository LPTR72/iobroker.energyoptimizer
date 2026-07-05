import type {
    ExecutionAction,
    ExecutionActionType,
    ExecutionPlan,
    OptimizationCapability,
    OptimizationCapabilityType,
    OptimizationConstraint,
    Recommendation,
    RecommendationType,
} from "./optimization";

interface ActionMapping {
    readonly actionType: ExecutionActionType;
    readonly capabilityType: OptimizationCapabilityType;
}

export class ExecutionPlanner {
    public plan(
        recommendations: readonly Recommendation[],
        capabilities: readonly OptimizationCapability[],
        constraints: readonly OptimizationConstraint[],
        generatedAt: number,
    ): ExecutionPlan {
        this.validateGeneratedAt(generatedAt);

        const recommendation = recommendations[0];
        if (!recommendation) {
            return {
                id: `plan:${generatedAt}:noop`,
                generatedAt,
                status: "noop",
                actions: [],
                warnings: [],
            };
        }

        const base = {
            generatedAt,
            sourceRecommendationType: recommendation.type,
            reason: { ...recommendation.reason },
        } as const;
        const mapping = this.actionMapping(recommendation.type);
        if (!mapping) {
            return {
                id: this.planId(generatedAt, recommendation.type, "blocked"),
                ...base,
                status: "blocked",
                actions: [],
                warnings: [`Recommendation ${recommendation.type} has no unambiguous execution action.`],
            };
        }

        const capability = this.selectCapability(recommendation, capabilities, mapping.capabilityType);
        if (!capability) {
            return {
                id: this.planId(generatedAt, recommendation.type, "blocked"),
                ...base,
                status: "blocked",
                actions: [],
                warnings: [`No ${mapping.capabilityType} capability is available for ${recommendation.type}.`],
            };
        }

        const warning = this.constraintWarning(recommendation, capability.assetId, mapping.capabilityType, constraints);
        if (warning) {
            return {
                id: this.planId(generatedAt, recommendation.type, capability.assetId),
                ...base,
                status: "blocked",
                actions: [],
                warnings: [warning],
            };
        }

        const action: ExecutionAction = {
            type: mapping.actionType,
            targetAssetId: capability.assetId,
            horizon: { ...recommendation.horizon },
            reason: recommendation.reason.description,
        };

        return {
            id: this.planId(generatedAt, recommendation.type, capability.assetId),
            ...base,
            status: "dormant",
            actions: [action],
            warnings: [],
        };
    }

    private actionMapping(type: RecommendationType): ActionMapping | undefined {
        switch (type) {
            case "charge_storage":
                return { actionType: "charge_storage", capabilityType: "charge_storage" };
            case "discharge_storage":
                return { actionType: "discharge_storage", capabilityType: "discharge_storage" };
            case "shift_consumption":
                return { actionType: "schedule_consumer", capabilityType: "shift_consumer" };
            case "avoid_feed_in":
                return { actionType: "limit_feed_in", capabilityType: "limit_feed_in" };
            case "increase_self_consumption":
            case "reduce_grid_import":
            case "prepare_for_price_window":
            case "protect_storage":
                return undefined;
        }
    }

    private selectCapability(
        recommendation: Recommendation,
        capabilities: readonly OptimizationCapability[],
        capabilityType: OptimizationCapabilityType,
    ): OptimizationCapability | undefined {
        const targetIds = recommendation.targetAssetIds;
        return [...capabilities]
            .filter(
                capability =>
                    capability.type === capabilityType &&
                    (!targetIds || targetIds.length === 0 || targetIds.includes(capability.assetId)),
            )
            .sort((left, right) => this.compareText(left.assetId, right.assetId))[0];
    }

    private constraintWarning(
        recommendation: Recommendation,
        assetId: string,
        capabilityType: OptimizationCapabilityType,
        constraints: readonly OptimizationConstraint[],
    ): string | undefined {
        for (const constraint of constraints) {
            if (!constraint.enabled || (constraint.assetId && constraint.assetId !== assetId)) continue;
            if (constraint.type === "manual_override") {
                return `Manual override blocks planning for ${assetId}.`;
            }
            if (
                constraint.type === "required_capability" &&
                constraint.requiredCapability &&
                constraint.requiredCapability !== capabilityType
            ) {
                return `Required capability ${constraint.requiredCapability} is not available for this action.`;
            }
            if (
                constraint.type === "time_window" &&
                constraint.horizon &&
                !this.overlaps(recommendation.horizon, constraint.horizon)
            ) {
                return `The recommendation is outside the allowed time window for ${assetId}.`;
            }
            if (
                constraint.type === "avoid_battery_cycling" &&
                (capabilityType === "charge_storage" || capabilityType === "discharge_storage")
            ) {
                return `Battery cycling is disabled for ${assetId}.`;
            }
        }
        return undefined;
    }

    private overlaps(
        left: Readonly<{ readonly from: number; readonly to: number }>,
        right: Readonly<{ readonly from: number; readonly to: number }>,
    ): boolean {
        if (left.from === left.to) return left.from >= right.from && left.from < right.to;
        return left.from < right.to && right.from < left.to;
    }

    private planId(generatedAt: number, recommendationType: RecommendationType, suffix: string): string {
        return `plan:${generatedAt}:${recommendationType}:${suffix}`;
    }

    private compareText(left: string, right: string): number {
        return left < right ? -1 : left > right ? 1 : 0;
    }

    private validateGeneratedAt(generatedAt: number): void {
        if (!Number.isFinite(generatedAt) || generatedAt < 0) {
            throw new RangeError("generatedAt must be a finite, non-negative timestamp.");
        }
    }
}
