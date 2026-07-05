import type {
    EnergySituation,
    ExecutionPlan,
    OptimizationCapability,
    OptimizationConstraint,
    OptimizationGoal,
    Recommendation,
} from "../src/lib/optimization";

const horizon = { from: 1_000, to: 2_000 } as const;

const situation: EnergySituation = {
    type: "pv_surplus",
    severity: "info",
    horizon,
    relatedAssetIds: ["pv.roof"],
};

const recommendation: Recommendation = {
    type: "charge_storage",
    priority: "high",
    horizon,
    reason: { code: "pv_surplus", description: "Store expected surplus" },
    relatedSituationTypes: [situation.type],
    targetAssetIds: ["storage.home"],
};

const capability: OptimizationCapability = {
    assetId: "storage.home",
    type: "charge_storage",
    minPowerW: 100,
    maxPowerW: 2_500,
    maxEnergyWh: 5_000,
    maxStateOfChargePercent: 90,
};

const constraint: OptimizationConstraint = {
    type: "required_capability",
    enabled: true,
    assetId: capability.assetId,
    requiredCapability: capability.type,
    maxPowerW: capability.maxPowerW,
    maxStateOfChargePercent: capability.maxStateOfChargePercent,
};

const goal: OptimizationGoal = {
    type: "maximize_self_consumption",
    priority: 100,
    enabled: true,
};

const plan: ExecutionPlan = {
    id: "plan:900:charge_storage:storage.home",
    generatedAt: 900,
    status: "ready",
    actions: [{ type: "charge_storage", targetAssetId: capability.assetId, powerW: 1_500, horizon }],
    warnings: [],
};

void [recommendation, constraint, goal, plan];

// @ts-expect-error Domain models are immutable.
goal.enabled = false;
// @ts-expect-error Action kinds are intentionally vendor-independent and closed.
plan.actions[0].type = "vendor_charge_mode";
