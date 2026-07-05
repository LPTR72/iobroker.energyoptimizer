const assert = require("node:assert/strict");
const test = require("node:test");
const { DEFAULT_EVALUATION_OPTIONS, EvaluationEngine } = require("../build/lib/EvaluationEngine");

const engine = new EvaluationEngine();

function analysis(overrides = {}) {
    return {
        timestamp: 1_000,
        totalConsumptionW: 1_000,
        totalPvProductionW: 1_000,
        totalBatteryChargePowerW: 0,
        totalBatteryDischargePowerW: 0,
        gridImportW: 0,
        gridExportW: 0,
        surplusW: 0,
        deficitW: 0,
        selfConsumptionW: 1_000,
        selfSufficiencyPercent: 100,
        pvUsagePercent: 100,
        batterySocPercentAverage: 50,
        assetHealth: [],
        ...overrides,
    };
}

function prediction(overrides = {}) {
    return {
        generatedAt: 900,
        horizon: { from: 1_000, to: 3_000 },
        power: [],
        prices: [],
        battery: [],
        warnings: [],
        ...overrides,
    };
}

test("evaluates observed power-flow situations", () => {
    const result = engine.evaluate(
        analysis({ surplusW: 500, gridImportW: 200, gridExportW: 100 }),
        prediction(),
    );

    assert.deepEqual(result.map(situation => situation.type), ["pv_surplus", "grid_import", "grid_export"]);
    assert.ok(result.every(situation => situation.horizon.from === 1_000));
});

test("ignores power below the default 20 W relevance threshold", () => {
    const belowThreshold = engine.evaluate(
        analysis({ surplusW: 19, gridImportW: 19, gridExportW: 19 }),
        prediction({
            power: [
                {
                    horizon: { from: 2_000, to: 3_000 },
                    expectedPvPowerW: 1_019,
                    expectedConsumptionPowerW: 1_000,
                    expectedSurplusW: 19,
                    expectedDeficitW: 0,
                },
            ],
        }),
    );
    const atThreshold = engine.evaluate(analysis({ surplusW: 20 }), prediction());

    assert.deepEqual(belowThreshold, []);
    assert.deepEqual(atThreshold.map(situation => situation.type), ["pv_surplus"]);
    assert.equal(DEFAULT_EVALUATION_OPTIONS.minimumRelevantPowerW, 20);
});

test("evaluates predicted surplus intervals", () => {
    const horizon = { from: 2_000, to: 3_000 };
    const result = engine.evaluate(
        analysis(),
        prediction({
            power: [
                {
                    horizon,
                    expectedPvPowerW: 1_500,
                    expectedConsumptionPowerW: 1_000,
                    expectedSurplusW: 500,
                    expectedDeficitW: 0,
                },
            ],
        }),
    );

    assert.deepEqual(result.map(situation => situation.type), ["pv_surplus"]);
    assert.deepEqual(result[0].horizon, horizon);
});

test("evaluates current and predicted battery situations for available battery assets", () => {
    const batteryHealth = [{ id: "battery.home", type: "battery", available: true }];
    const result = engine.evaluate(
        analysis({ batterySocPercentAverage: 15, assetHealth: batteryHealth }),
        prediction({
            battery: [
                { horizon: { from: 2_000, to: 3_000 }, expectedSocPercent: 97 },
                { horizon: { from: 3_000, to: 4_000 }, expectedSocPercent: 85 },
            ],
        }),
    );

    assert.deepEqual(result.map(situation => situation.type), ["battery_low", "battery_full_soon", "battery_high"]);
    assert.ok(result.every(situation => situation.relatedAssetIds[0] === "battery.home"));
});

test("does not report a low battery when no battery asset is available", () => {
    const result = engine.evaluate(
        analysis({ batterySocPercentAverage: 0 }),
        prediction({ battery: [{ horizon: { from: 1_000, to: 2_000 }, expectedSocPercent: 0 }] }),
    );

    assert.equal(result.some(situation => situation.type === "battery_low"), false);
});

test("supports the placeholder default price thresholds", () => {
    const result = engine.evaluate(
        analysis(),
        prediction({
            prices: [
                { horizon: { from: 1_000, to: 2_000 }, expectedGridPriceCtPerKWh: 10 },
                { horizon: { from: 2_000, to: 3_000 }, expectedGridPriceCtPerKWh: 50 },
                { horizon: { from: 3_000, to: 4_000 }, expectedGridPriceCtPerKWh: 30 },
            ],
        }),
    );

    assert.deepEqual(result.map(situation => situation.type), ["cheap_price_period", "high_price_period"]);
});

test("uses deployment-specific custom price thresholds", () => {
    const customEngine = new EvaluationEngine({
        ...DEFAULT_EVALUATION_OPTIONS,
        cheapPriceCtPerKWh: 5,
        highPriceCtPerKWh: 100,
    });
    const result = customEngine.evaluate(
        analysis(),
        prediction({
            prices: [
                { horizon: { from: 1_000, to: 2_000 }, expectedGridPriceCtPerKWh: 10 },
                { horizon: { from: 2_000, to: 3_000 }, expectedGridPriceCtPerKWh: 50 },
            ],
        }),
    );

    assert.deepEqual(result, []);
});

test("reports forecast uncertainty once when prediction warnings exist", () => {
    const result = engine.evaluate(
        analysis(),
        prediction({
            warnings: [
                { code: "missing_pv_forecast", message: "PV forecast is incomplete." },
                { code: "missing_consumption_forecast", message: "Consumption forecast is incomplete." },
            ],
        }),
    );

    assert.deepEqual(result.map(situation => situation.type), ["forecast_uncertain"]);
    assert.deepEqual(result[0].horizon, { from: 1_000, to: 3_000 });
});

test("supports validated custom thresholds", () => {
    const customEngine = new EvaluationEngine({
        ...DEFAULT_EVALUATION_OPTIONS,
        minimumRelevantPowerW: 500,
        lowBatterySocPercent: 10,
    });

    assert.deepEqual(customEngine.evaluate(analysis({ surplusW: 499 }), prediction()), []);
    assert.throws(
        () =>
            new EvaluationEngine({
                ...DEFAULT_EVALUATION_OPTIONS,
                highBatterySocPercent: 10,
                lowBatterySocPercent: 20,
            }),
        /Battery thresholds must be ordered/,
    );
    assert.throws(
        () =>
            new EvaluationEngine({
                ...DEFAULT_EVALUATION_OPTIONS,
                minimumRelevantPowerW: -1,
            }),
        /minimumRelevantPowerW must not be negative/,
    );
    assert.throws(
        () =>
            new EvaluationEngine({
                ...DEFAULT_EVALUATION_OPTIONS,
                cheapPriceCtPerKWh: 50,
                highPriceCtPerKWh: 40,
            }),
        /cheapPriceCtPerKWh must not exceed highPriceCtPerKWh/,
    );
});
