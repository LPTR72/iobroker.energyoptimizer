const assert = require("node:assert/strict");
const test = require("node:test");

test("a situation references a prediction horizon", () => {
    const situation = {
        type: "pv_surplus",
        severity: "info",
        horizon: { from: 1000, to: 2000 },
    };

    assert.deepEqual(situation.horizon, { from: 1000, to: 2000 });
});

test("a recommendation references situation types", () => {
    const recommendation = {
        type: "charge_battery",
        priority: "high",
        horizon: { from: 1000, to: 2000 },
        reason: "Use expected PV surplus",
        relatedSituationTypes: ["pv_surplus", "battery_low"],
    };

    assert.deepEqual(recommendation.relatedSituationTypes, ["pv_surplus", "battery_low"]);
});

test("an execution plan represents noop", () => {
    const plan = {
        generatedAt: 1000,
        status: "noop",
        actions: [{ type: "noop", reason: "No action required" }],
        warnings: [],
    };

    assert.equal(plan.status, "noop");
    assert.equal(plan.actions[0].type, "noop");
});

test("an execution plan represents a battery charge action", () => {
    const plan = {
        generatedAt: 1000,
        status: "ready",
        actions: [{ type: "set_battery_charge_power", targetAssetId: "battery.default", powerW: 1500 }],
        warnings: [],
    };

    assert.equal(plan.actions[0].targetAssetId, "battery.default");
    assert.equal(plan.actions[0].powerW, 1500);
});

test("a device capability expresses maximum battery charge power", () => {
    const capability = {
        assetId: "battery.default",
        type: "battery_charge_power",
        minPowerW: 0,
        maxPowerW: 2500,
    };

    assert.equal(capability.maxPowerW, 2500);
});

test("a constraint expresses an 800 W feed-in limit", () => {
    const constraint = {
        type: "max_feed_in_power",
        enabled: true,
        value: 800,
    };

    assert.equal(constraint.value, 800);
});

test("goals express maximizing self-consumption and protecting the battery", () => {
    const goals = [
        { type: "maximize_self_consumption", priority: 90, enabled: true },
        { type: "protect_battery", priority: 100, enabled: true },
    ];

    assert.deepEqual(
        goals.map(goal => goal.type),
        ["maximize_self_consumption", "protect_battery"],
    );
    assert.ok(goals.every(goal => goal.priority >= 1 && goal.priority <= 100));
});
