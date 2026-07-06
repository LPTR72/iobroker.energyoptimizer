import type { PredictionHorizon } from "./prediction";
import type {
    ExecutionAction,
    ExecutionActionLimits,
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

interface LimitsResult {
    readonly limits?: Readonly<ExecutionActionLimits>;
    readonly warning?: string;
}

interface RangeDefinition {
    readonly name: string;
    readonly minimums: readonly (number | undefined)[];
    readonly maximums: readonly (number | undefined)[];
    readonly absoluteMaximum?: number;
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
            validUntil: recommendation.horizon.to,
            sourceRecommendationType: recommendation.type,
            reason: { ...recommendation.reason },
        } as const;
        const horizonWarning = this.horizonWarning(recommendation.horizon, generatedAt);
        if (horizonWarning) return this.blockedPlan(recommendation, base, "blocked", horizonWarning);

        const mapping = this.actionMapping(recommendation.type);
        if (!mapping) {
            return this.blockedPlan(
                recommendation,
                base,
                "blocked",
                `Recommendation ${recommendation.type} has no unambiguous execution action.`,
            );
        }

        const capability = this.selectCapability(recommendation, capabilities, mapping.capabilityType);
        if (!capability) {
            return this.blockedPlan(
                recommendation,
                base,
                "blocked",
                `No ${mapping.capabilityType} capability is available for ${recommendation.type}.`,
            );
        }

        const applicableConstraints = constraints.filter(
            constraint => constraint.enabled && (!constraint.assetId || constraint.assetId === capability.assetId),
        );
        const warning = this.constraintWarning(capability.assetId, mapping.capabilityType, applicableConstraints);
        if (warning) return this.blockedPlan(recommendation, base, capability.assetId, warning);

        const horizon = this.constrainedHorizon(recommendation.horizon, applicableConstraints, generatedAt);
        if (!horizon) {
            return this.blockedPlan(
                recommendation,
                base,
                capability.assetId,
                `No allowed time remains for ${capability.assetId}.`,
            );
        }

        const limitsResult = this.actionLimits(capability, applicableConstraints);
        if (limitsResult.warning) {
            return this.blockedPlan(recommendation, base, capability.assetId, limitsResult.warning);
        }

        const conflict = this.conflictWarning(
            recommendation,
            recommendations.slice(1),
            capability.assetId,
            mapping,
            horizon,
            capabilities,
            generatedAt,
        );
        if (conflict) return this.blockedPlan(recommendation, base, capability.assetId, conflict);

        const action: ExecutionAction = {
            type: mapping.actionType,
            targetAssetId: capability.assetId,
            horizon,
            ...(limitsResult.limits ? { limits: limitsResult.limits } : {}),
            reason: recommendation.reason.description,
        };

        return {
            id: this.planId(generatedAt, recommendation.type, capability.assetId),
            ...base,
            validUntil: horizon.to,
            status: "dormant",
            actions: [action],
            warnings: [],
        };
    }

    private blockedPlan(
        recommendation: Recommendation,
        base: Readonly<{
            generatedAt: number;
            validUntil: number;
            sourceRecommendationType: RecommendationType;
            reason: Recommendation["reason"];
        }>,
        suffix: string,
        warning: string,
    ): ExecutionPlan {
        return {
            id: this.planId(base.generatedAt, recommendation.type, suffix),
            ...base,
            status: "blocked",
            actions: [],
            warnings: [warning],
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
        assetId: string,
        capabilityType: OptimizationCapabilityType,
        constraints: readonly OptimizationConstraint[],
    ): string | undefined {
        for (const constraint of constraints) {
            if (constraint.type === "manual_override") return `Manual override blocks planning for ${assetId}.`;
            if (
                constraint.type === "required_capability" &&
                constraint.requiredCapability &&
                constraint.requiredCapability !== capabilityType
            ) {
                return `Required capability ${constraint.requiredCapability} is not available for this action.`;
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

    private constrainedHorizon(
        horizon: Readonly<PredictionHorizon>,
        constraints: readonly OptimizationConstraint[],
        generatedAt: number,
    ): Readonly<PredictionHorizon> | undefined {
        let from = Math.max(horizon.from, generatedAt);
        let to = horizon.to;
        for (const constraint of constraints) {
            if (constraint.type !== "time_window" || !constraint.horizon) continue;
            from = Math.max(from, constraint.horizon.from);
            to = Math.min(to, constraint.horizon.to);
        }
        return from < to ? { from, to } : undefined;
    }

    private actionLimits(
        capability: OptimizationCapability,
        constraints: readonly OptimizationConstraint[],
    ): LimitsResult {
        if (capability.powerStepW !== undefined && (!Number.isFinite(capability.powerStepW) || capability.powerStepW <= 0)) {
            return { warning: `Power step for ${capability.assetId} must be a finite positive number.` };
        }

        const powerConstraints = constraints.filter(constraint => constraint.type === "power_limit");
        const energyConstraints = constraints.filter(constraint => constraint.type === "energy_limit");
        const durationConstraints = constraints.filter(constraint => constraint.type === "duration_limit");
        const stateOfChargeConstraints = constraints.filter(constraint => constraint.type === "state_of_charge_limit");
        const ranges = [
            this.range({
                name: "power",
                minimums: [capability.minPowerW, ...powerConstraints.map(constraint => constraint.minPowerW)],
                maximums: [capability.maxPowerW, ...powerConstraints.map(constraint => constraint.maxPowerW)],
            }),
            this.range({
                name: "energy",
                minimums: energyConstraints.map(constraint => constraint.minEnergyWh),
                maximums: [capability.maxEnergyWh, ...energyConstraints.map(constraint => constraint.maxEnergyWh)],
            }),
            this.range({
                name: "duration",
                minimums: [
                    capability.minDurationMinutes,
                    ...durationConstraints.map(constraint => constraint.minDurationMinutes),
                ],
                maximums: [
                    capability.maxDurationMinutes,
                    ...durationConstraints.map(constraint => constraint.maxDurationMinutes),
                ],
            }),
            this.range({
                name: "state of charge",
                minimums: [
                    capability.minStateOfChargePercent,
                    ...stateOfChargeConstraints.map(constraint => constraint.minStateOfChargePercent),
                ],
                maximums: [
                    capability.maxStateOfChargePercent,
                    ...stateOfChargeConstraints.map(constraint => constraint.maxStateOfChargePercent),
                ],
                absoluteMaximum: 100,
            }),
        ];
        const invalid = ranges.find(result => result.warning);
        if (invalid?.warning) return { warning: invalid.warning };

        const [power, energy, duration, stateOfCharge] = ranges;
        const limits: ExecutionActionLimits = {
            ...(power.minimum !== undefined ? { minPowerW: power.minimum } : {}),
            ...(power.maximum !== undefined ? { maxPowerW: power.maximum } : {}),
            ...(capability.powerStepW !== undefined ? { powerStepW: capability.powerStepW } : {}),
            ...(energy.minimum !== undefined ? { minEnergyWh: energy.minimum } : {}),
            ...(energy.maximum !== undefined ? { maxEnergyWh: energy.maximum } : {}),
            ...(duration.minimum !== undefined ? { minDurationMinutes: duration.minimum } : {}),
            ...(duration.maximum !== undefined ? { maxDurationMinutes: duration.maximum } : {}),
            ...(stateOfCharge.minimum !== undefined ? { minStateOfChargePercent: stateOfCharge.minimum } : {}),
            ...(stateOfCharge.maximum !== undefined ? { maxStateOfChargePercent: stateOfCharge.maximum } : {}),
        };
        return { ...(Object.keys(limits).length > 0 ? { limits } : {}) };
    }

    private range(definition: RangeDefinition): {
        readonly minimum?: number;
        readonly maximum?: number;
        readonly warning?: string;
    } {
        const minimums = definition.minimums.filter((value): value is number => value !== undefined);
        const maximums = definition.maximums.filter((value): value is number => value !== undefined);
        const values = [...minimums, ...maximums];
        if (
            values.some(
                value =>
                    !Number.isFinite(value) || value < 0 ||
                    (definition.absoluteMaximum !== undefined && value > definition.absoluteMaximum),
            )
        ) {
            return { warning: `The ${definition.name} limits must contain finite values within their valid range.` };
        }
        const minimum = minimums.length > 0 ? Math.max(...minimums) : undefined;
        const maximum = maximums.length > 0 ? Math.min(...maximums) : undefined;
        if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
            return { warning: `The ${definition.name} limits do not define a feasible range.` };
        }
        return { ...(minimum !== undefined ? { minimum } : {}), ...(maximum !== undefined ? { maximum } : {}) };
    }

    private conflictWarning(
        selected: Recommendation,
        remaining: readonly Recommendation[],
        assetId: string,
        selectedMapping: ActionMapping,
        selectedHorizon: Readonly<PredictionHorizon>,
        capabilities: readonly OptimizationCapability[],
        generatedAt: number,
    ): string | undefined {
        for (const recommendation of remaining) {
            const mapping = this.actionMapping(recommendation.type);
            if (!mapping || !this.opposes(selectedMapping.actionType, mapping.actionType)) continue;
            if (recommendation.targetAssetIds?.length && !recommendation.targetAssetIds.includes(assetId)) continue;
            if (!capabilities.some(capability => capability.assetId === assetId && capability.type === mapping.capabilityType)) {
                continue;
            }
            const opposingHorizon = this.futureEffectiveHorizon(recommendation.horizon, generatedAt);
            if (opposingHorizon && this.overlaps(selectedHorizon, opposingHorizon)) {
                return `Conflicting recommendations ${selected.type} and ${recommendation.type} target ${assetId}.`;
            }
        }
        return undefined;
    }

    private opposes(left: ExecutionActionType, right: ExecutionActionType): boolean {
        return (
            (left === "charge_storage" && right === "discharge_storage") ||
            (left === "discharge_storage" && right === "charge_storage") ||
            (left === "switch_consumer_on" && right === "switch_consumer_off") ||
            (left === "switch_consumer_off" && right === "switch_consumer_on")
        );
    }

    private overlaps(left: Readonly<PredictionHorizon>, right: Readonly<PredictionHorizon>): boolean {
        return left.from < right.to && right.from < left.to;
    }

    private futureEffectiveHorizon(
        horizon: Readonly<PredictionHorizon>,
        generatedAt: number,
    ): Readonly<PredictionHorizon> | undefined {
        if (!Number.isFinite(horizon.from) || !Number.isFinite(horizon.to) || horizon.from >= horizon.to) {
            return undefined;
        }
        const from = Math.max(horizon.from, generatedAt);
        return from < horizon.to ? { from, to: horizon.to } : undefined;
    }

    private horizonWarning(horizon: Readonly<PredictionHorizon>, generatedAt: number): string | undefined {
        if (!Number.isFinite(horizon.from) || !Number.isFinite(horizon.to) || horizon.from >= horizon.to) {
            return "Recommendation horizon must define a finite, non-empty time range.";
        }
        if (horizon.to <= generatedAt) return "Recommendation has expired.";
        return undefined;
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
