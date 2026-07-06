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
    assert.equal(result.validUntil, 2_000);
    assert.deepEqual(result.actions, [
        {
            type: "charge_storage",
            targetAssetId: "storage.home",
            horizon: { from: 1_000, to: 2_000 },
            limits: { maxPowerW: 2_000 },
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

test("intersects capability and constraint limits without selecting a device setpoint", () => {
    const result = planner.plan(
        [recommendation()],
        [
            {
                assetId: "storage.home",
                type: "charge_storage",
                minPowerW: 100,
                maxPowerW: 2_500,
                powerStepW: 50,
                maxEnergyWh: 5_000,
                minDurationMinutes: 10,
                maxDurationMinutes: 180,
                minStateOfChargePercent: 10,
                maxStateOfChargePercent: 95,
            },
        ],
        [
            { type: "power_limit", enabled: true, minPowerW: 200, maxPowerW: 2_000 },
            { type: "energy_limit", enabled: true, minEnergyWh: 500, maxEnergyWh: 4_000 },
            { type: "duration_limit", enabled: true, minDurationMinutes: 20, maxDurationMinutes: 120 },
            {
                type: "state_of_charge_limit",
                enabled: true,
                minStateOfChargePercent: 20,
                maxStateOfChargePercent: 90,
            },
        ],
        900,
    );

    assert.equal(result.status, "dormant");
    assert.deepEqual(result.actions[0].limits, {
        minPowerW: 200,
        maxPowerW: 2_000,
        powerStepW: 50,
        minEnergyWh: 500,
        maxEnergyWh: 4_000,
        minDurationMinutes: 20,
        maxDurationMinutes: 120,
        minStateOfChargePercent: 20,
        maxStateOfChargePercent: 90,
    });
    assert.equal(result.actions[0].powerW, undefined);
});

test("blocks plans with incompatible physical limits", () => {
    const result = planner.plan(
        [recommendation()],
        [{ assetId: "storage.home", type: "charge_storage", minPowerW: 500, maxPowerW: 2_000 }],
        [{ type: "power_limit", enabled: true, maxPowerW: 400 }],
        900,
    );

    assert.equal(result.status, "blocked");
    assert.deepEqual(result.actions, []);
    assert.match(result.warnings[0], /power limits do not define a feasible range/);
});

test("clips the action horizon to allowed time windows", () => {
    const result = planner.plan(
        [recommendation()],
        [{ assetId: "storage.home", type: "charge_storage" }],
        [{ type: "time_window", enabled: true, horizon: { from: 1_200, to: 1_800 } }],
        900,
    );

    assert.equal(result.status, "dormant");
    assert.deepEqual(result.actions[0].horizon, { from: 1_200, to: 1_800 });
    assert.equal(result.validUntil, 1_800);
});

test("blocks expired recommendations", () => {
    const result = planner.plan(
        [recommendation({ horizon: { from: 1_000, to: 2_000 } })],
        [{ assetId: "storage.home", type: "charge_storage" }],
        [],
        2_000,
    );

    assert.equal(result.status, "blocked");
    assert.match(result.warnings[0], /expired/);
});

test("clips a partially elapsed recommendation to the generation time", () => {
    const result = planner.plan(
        [recommendation({ horizon: { from: 500, to: 2_000 } })],
        [{ assetId: "storage.home", type: "charge_storage" }],
        [],
        1_000,
    );

    assert.equal(result.status, "dormant");
    assert.deepEqual(result.actions[0].horizon, { from: 1_000, to: 2_000 });
    assert.equal(result.validUntil, 2_000);
});

test("ignores an expired opposing storage recommendation during conflict checks", () => {
    const result = planner.plan(
        [
            recommendation({ horizon: { from: 500, to: 2_000 } }),
            recommendation({
                type: "discharge_storage",
                horizon: { from: 500, to: 900 },
                reason: { code: "grid_import", description: "Discharge during import." },
            }),
        ],
        [
            { assetId: "storage.home", type: "charge_storage" },
            { assetId: "storage.home", type: "discharge_storage" },
        ],
        [],
        1_000,
    );

    assert.equal(result.status, "dormant");
    assert.deepEqual(result.actions[0].horizon, { from: 1_000, to: 2_000 });
    assert.deepEqual(result.warnings, []);
});

test("blocks overlapping opposite actions for the same asset", () => {
    const result = planner.plan(
        [
            recommendation(),
            recommendation({
                type: "discharge_storage",
                reason: { code: "grid_import", description: "Discharge during import." },
            }),
        ],
        [
            { assetId: "storage.home", type: "charge_storage" },
            { assetId: "storage.home", type: "discharge_storage" },
        ],
        [],
        900,
    );

    assert.equal(result.status, "blocked");
    assert.deepEqual(result.actions, []);
    assert.match(result.warnings[0], /Conflicting recommendations/);
});
