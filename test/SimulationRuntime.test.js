const assert = require("node:assert/strict");
const test = require("node:test");
const { SimulationRuntime } = require("../build/lib/SimulationRuntime");

class StateProvider {
    constructor(values) {
        this.values = values;
    }

    async readNumericState(id) {
        return id ? this.values[id] : undefined;
    }
}

function config() {
    return {
        sourceGridImportPower: "source.grid.import",
        sourceGridExportPower: "source.grid.export",
        sourceHouseConsumptionPower: "source.house",
        sourcePvPower: "source.pv",
    };
}

function runtime(values) {
    return new SimulationRuntime(new StateProvider(values), () => 1_000);
}

test("simulates a relevant surplus and produces explainable recommendations", async () => {
    const result = await runtime({
        "source.grid.import": 0,
        "source.grid.export": 500,
        "source.house": 500,
        "source.pv": 1_000,
    }).simulate(config());

    assert.equal(result.analysis.surplusW, 500);
    assert.ok(result.situations.some(situation => situation.type === "pv_surplus"));
    assert.ok(result.recommendations.some(recommendation => recommendation.type === "avoid_feed_in"));
    assert.ok(result.recommendations.some(recommendation => recommendation.type === "increase_self_consumption"));
    assert.ok(result.recommendations.every(recommendation => recommendation.reason.description.length > 0));
    assert.equal(result.missingSourcesCount, 0);
});

test("simulates a relevant deficit and recommends reducing grid import", async () => {
    const result = await runtime({
        "source.grid.import": 400,
        "source.grid.export": 0,
        "source.house": 1_000,
        "source.pv": 600,
    }).simulate(config());

    assert.equal(result.analysis.deficitW, 400);
    assert.ok(result.situations.some(situation => situation.type === "grid_import"));
    assert.deepEqual(result.recommendations.map(recommendation => recommendation.type), ["reduce_grid_import"]);
});

test("remains neutral inside the 20 W relevance threshold", async () => {
    const result = await runtime({
        "source.grid.import": 19,
        "source.grid.export": 0,
        "source.house": 981,
        "source.pv": 1_000,
    }).simulate(config());

    assert.equal(result.analysis.surplusW, 19);
    assert.deepEqual(result.situations, []);
    assert.deepEqual(result.recommendations, []);
});

test("reports incomplete configured sources without inventing recommendations", async () => {
    const result = await runtime({
        "source.grid.import": 0,
        "source.grid.export": 0,
        "source.pv": 1_000,
    }).simulate(config());

    assert.equal(result.configuredSourcesCount, 4);
    assert.equal(result.validSourcesCount, 3);
    assert.equal(result.missingSourcesCount, 1);
    assert.deepEqual(result.warnings, [
        {
            code: "incomplete_source_data",
            message: "One or more configured source states have no valid numeric value.",
            missingSourceIds: ["source.house"],
        },
    ]);
    assert.deepEqual(result.recommendations, []);
});
