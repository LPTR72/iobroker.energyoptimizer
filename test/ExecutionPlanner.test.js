const assert = require("node:assert/strict");
const test = require("node:test");
const { ExecutionPlanner } = require("../build/lib/ExecutionPlanner");

const planner = new ExecutionPlanner();

function recommendation(overrides = {}) {
    return {
        type: "charge_storage",
        priority: "high",
        horizon: { from: 1_000, to: 2_000 },
        reason: { code: "pv_surplus", description: "Store expected surplus." },
        targetAssetIds: ["storage.home"],
        ...overrides,
    };
}

test("returns a deterministic noop plan without a recommendation", () => {
    assert.deepEqual(planner.plan([], [], [], 900), {
        id: "plan:900:noop",
        generatedAt: 900,
        status: "noop",
        actions: [],
        warnings: [],
    });
});

test("creates a dormant neutral plan for an unambiguous recommendation", () => {
    const result = planner.plan(
        [recommendation()],
        [{ assetId: "storage.home", type: "charge_storage", maxPowerW: 2_000 }],
        [],
        900,
    );

    assert.equal(result.id, "plan:900:charge_storage:storage.home");
    assert.equal(result.status, "dormant");
    assert.equal(result.sourceRecommendationType, "charge_storage");
    assert.deepEqual(result.actions, [
        {
            type: "charge_storage",
            targetAssetId: "storage.home",
            horizon: { from: 1_000, to: 2_000 },
            reason: "Store expected surplus.",
        },
    ]);
});

test("blocks planning when capability or constraints do not allow an action", () => {
    const missingCapability = planner.plan([recommendation()], [], [], 900);
    assert.equal(missingCapability.status, "blocked");
    assert.deepEqual(missingCapability.actions, []);

    const manualOverride = planner.plan(
        [recommendation()],
        [{ assetId: "storage.home", type: "charge_storage" }],
        [{ type: "manual_override", enabled: true, assetId: "storage.home" }],
        900,
    );
    assert.equal(manualOverride.status, "blocked");
    assert.match(manualOverride.warnings[0], /Manual override/);
});

test("does not guess an action for an abstract recommendation", () => {
    const result = planner.plan(
        [recommendation({ type: "reduce_grid_import", targetAssetIds: undefined })],
        [{ assetId: "storage.home", type: "discharge_storage" }],
        [],
        900,
    );

    assert.equal(result.status, "blocked");
    assert.deepEqual(result.actions, []);
    assert.match(result.warnings[0], /no unambiguous execution action/);
});

test("does not mutate recommendations, capabilities, or constraints", () => {
    const recommendations = [recommendation()];
    const capabilities = [{ assetId: "storage.home", type: "charge_storage" }];
    const constraints = [{ type: "manual_override", enabled: false }];
    const before = JSON.stringify({ recommendations, capabilities, constraints });

    planner.plan(recommendations, capabilities, constraints, 900);

    assert.equal(JSON.stringify({ recommendations, capabilities, constraints }), before);
});

test("rejects an invalid generation timestamp", () => {
    assert.throws(() => planner.plan([], [], [], -1), /generatedAt must be a finite, non-negative timestamp/);
});
