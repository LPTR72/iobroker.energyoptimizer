const assert = require("node:assert/strict");
const test = require("node:test");

test("optimization models compose into a neutral plan", () => {
    const situation = {
        type: "pv_surplus",
        severity: "info",
        horizon: { from: 1000, to: 2000 },
        relatedAssetIds: ["pv.roof"],
    };
    const recommendation = {
        type: "charge_storage",
        priority: "high",
        horizon: situation.horizon,
        reason: { code: "pv_surplus", description: "Store expected surplus" },
        relatedSituationTypes: [situation.type],
        targetAssetIds: ["storage.home"],
    };
    const plan = {
        generatedAt: 900,
        status: "ready",
        actions: [{ type: "charge_storage", targetAssetId: "storage.home", powerW: 1500 }],
        warnings: [],
    };

    assert.equal(recommendation.reason.code, "pv_surplus");
    assert.equal(plan.actions[0].targetAssetId, recommendation.targetAssetIds[0]);
});

test("capabilities and constraints express neutral operating bounds", () => {
    const capability = {
        assetId: "storage.home",
        type: "charge_storage",
        minPowerW: 100,
        maxPowerW: 2500,
        maxEnergyWh: 5000,
        maxStateOfChargePercent: 90,
    };
    const constraint = {
        type: "required_capability",
        enabled: true,
        assetId: capability.assetId,
        requiredCapability: capability.type,
        maxPowerW: capability.maxPowerW,
        maxStateOfChargePercent: capability.maxStateOfChargePercent,
    };

    assert.equal(constraint.requiredCapability, "charge_storage");
    assert.equal(constraint.maxPowerW, 2500);
});

test("goals cover self-consumption, grid import, and feed-in", () => {
    const goals = ["maximize_self_consumption", "minimize_grid_import", "avoid_feed_in"];

    assert.deepEqual(goals, ["maximize_self_consumption", "minimize_grid_import", "avoid_feed_in"]);
});
