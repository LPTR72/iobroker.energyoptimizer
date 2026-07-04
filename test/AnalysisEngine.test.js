const assert = require("node:assert/strict");
const test = require("node:test");
const { AnalysisEngine } = require("../build/lib/AnalysisEngine");

function asset(id, type, currentPowerW, socPercent) {
    return { id, type, currentPowerW, socPercent, capabilities: [] };
}

function systemState(assets, grid = {}) {
    return {
        grid,
        pv: {},
        pvSystems: [],
        battery: { id: "default" },
        batteries: [],
        house: {},
        assets,
    };
}

const engine = new AnalysisEngine();

test("calculates surplus when PV production exceeds consumption", () => {
    const result = engine.analyze(systemState([asset("pv", "pv", 1500), asset("house", "consumer", 1000)]));

    assert.equal(result.surplusW, 500);
    assert.equal(result.deficitW, 0);
    assert.equal(result.selfConsumptionW, 1000);
    assert.equal(result.selfSufficiencyPercent, 100);
    assert.ok(Math.abs(result.pvUsagePercent - 66.66666666666666) < 0.000001);
});

test("calculates deficit when consumption exceeds PV production", () => {
    const result = engine.analyze(systemState([asset("pv", "pv", 400), asset("house", "consumer", 1000)]));

    assert.equal(result.surplusW, 0);
    assert.equal(result.deficitW, 600);
    assert.equal(result.selfSufficiencyPercent, 40);
});

test("handles missing values and unavailable assets", () => {
    const result = engine.analyze(systemState([asset("unknown", "unknown")]));

    assert.equal(result.totalConsumptionW, 0);
    assert.equal(result.totalPvProductionW, 0);
    assert.equal(result.batterySocPercentAverage, 0);
    assert.deepEqual(result.assetHealth, [{ id: "unknown", type: "unknown", available: false }]);
});

test("sums multiple PV assets", () => {
    const result = engine.analyze(systemState([asset("pv-1", "pv", 400), asset("pv-2", "pv", 600)]));

    assert.equal(result.totalPvProductionW, 1000);
});

test("separates charging and discharging across multiple batteries", () => {
    const result = engine.analyze(
        systemState([asset("battery-1", "battery", 500, 40), asset("battery-2", "battery", -300, 60)]),
    );

    assert.equal(result.totalBatteryChargePowerW, 500);
    assert.equal(result.totalBatteryDischargePowerW, 300);
    assert.equal(result.batterySocPercentAverage, 50);
});

test("avoids division by zero when production is zero", () => {
    const result = engine.analyze(systemState([asset("pv", "pv", 0), asset("house", "consumer", 500)]));

    assert.equal(result.pvUsagePercent, 0);
    assert.equal(result.selfSufficiencyPercent, 0);
    assert.equal(result.deficitW, 500);
});

test("falls back to the house compatibility view when no consumer asset exists", () => {
    const state = systemState([asset("pv", "pv", 200)]);
    state.house.consumptionPowerW = 750;

    const result = engine.analyze(state);

    assert.equal(result.totalConsumptionW, 750);
    assert.equal(result.deficitW, 550);
});

test("copies valid grid power and safely handles invalid grid power", () => {
    const result = engine.analyze(systemState([], { importPowerW: 420, exportPowerW: 80 }));
    const invalidResult = engine.analyze(systemState([], { importPowerW: Number.NaN, exportPowerW: -10 }));

    assert.equal(result.gridImportW, 420);
    assert.equal(result.gridExportW, 80);
    assert.equal(invalidResult.gridImportW, 0);
    assert.equal(invalidResult.gridExportW, 0);
});
