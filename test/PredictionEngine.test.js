const assert = require("node:assert/strict");
const test = require("node:test");
const { DEFAULT_PREDICTION_OPTIONS, PredictionEngine } = require("../build/lib/PredictionEngine");

const engine = new PredictionEngine();
const MINUTE = 60_000;

function analysis(overrides = {}) {
    return {
        totalPvProductionW: 500,
        totalConsumptionW: 700,
        batterySocPercentAverage: 55,
        ...overrides,
    };
}

function forecast(overrides = {}) {
    return {
        generatedAt: 100,
        validFrom: 1_000,
        validTo: 1_000 + 24 * 60 * MINUTE,
        pvPower: [{ timestamp: 1_000, powerW: 1200 }],
        consumptionPower: [{ timestamp: 1_000, powerW: 800 }],
        gridPrice: [],
        weather: [],
        ...overrides,
    };
}

test("maps normal PV and consumption forecasts", () => {
    const result = engine.predict(analysis(), forecast());

    assert.equal(result.generatedAt, 100);
    assert.deepEqual(result.horizon, { from: 1_000, to: 1_000 + 24 * 60 * MINUTE });
    assert.equal(result.power[0].expectedPvPowerW, 1200);
    assert.equal(result.power[0].expectedConsumptionPowerW, 800);
});

test("predicts a surplus", () => {
    const result = engine.predict(analysis(), forecast());

    assert.equal(result.power[0].expectedSurplusW, 400);
    assert.equal(result.power[0].expectedDeficitW, 0);
});

test("predicts a deficit", () => {
    const result = engine.predict(
        analysis(),
        forecast({ pvPower: [{ timestamp: 1000, powerW: 300 }], consumptionPower: [{ timestamp: 1000, powerW: 900 }] }),
    );

    assert.equal(result.power[0].expectedSurplusW, 0);
    assert.equal(result.power[0].expectedDeficitW, 600);
});

test("falls back to current consumption when its forecast is missing", () => {
    const result = engine.predict(analysis({ totalConsumptionW: 750 }), forecast({ consumptionPower: [] }));

    assert.equal(result.power[0].expectedConsumptionPowerW, 750);
    assert.ok(result.warnings.some(warning => warning.code === "missing_consumption_forecast"));
});

test("falls back to current PV production when its forecast is missing", () => {
    const result = engine.predict(analysis({ totalPvProductionW: 450 }), forecast({ pvPower: [] }));

    assert.equal(result.power[0].expectedPvPowerW, 450);
    assert.ok(result.warnings.some(warning => warning.code === "missing_pv_forecast"));
});

test("falls back to current analysis when power forecasts are empty", () => {
    const result = engine.predict(
        analysis({ totalPvProductionW: 400, totalConsumptionW: 650 }),
        forecast({ pvPower: [], consumptionPower: [] }),
    );

    assert.equal(result.power.length, 96);
    assert.deepEqual(result.power[0].horizon, { from: 1_000, to: 1_000 + 15 * MINUTE });
    assert.equal(result.power[0].expectedPvPowerW, 400);
    assert.equal(result.power[0].expectedConsumptionPowerW, 650);
    assert.ok(result.warnings.some(warning => warning.code === "missing_forecast_data"));
});

test("maps grid price forecasts", () => {
    const result = engine.predict(
        analysis(),
        forecast({ gridPrice: [{ timestamp: 1000, priceCtPerKWh: 31.5 }] }),
    );

    assert.equal(result.prices[0].expectedGridPriceCtPerKWh, 31.5);
    assert.deepEqual(result.prices[0].horizon, { from: 1_000, to: 1_000 + 15 * MINUTE });
});

test("uses current battery SOC for each prediction interval", () => {
    const result = engine.predict(analysis({ batterySocPercentAverage: 62 }), forecast());

    assert.equal(result.battery[0].expectedSocPercent, 62);
    assert.deepEqual(result.battery[0].horizon, result.power[0].horizon);
});

test("emits warnings for incomplete data at different timestamps", () => {
    const result = engine.predict(
        analysis(),
        forecast({
            pvPower: [{ timestamp: 1_000, powerW: 900 }],
            consumptionPower: [{ timestamp: 1_000 + 15 * MINUTE, powerW: 600 }],
        }),
    );

    assert.deepEqual(
        result.warnings.map(warning => warning.code).sort(),
        ["missing_consumption_forecast", "missing_pv_forecast"],
    );
    assert.equal(result.power.length, 96);
});

test("uses sensible default prediction options", () => {
    const result = engine.predict(analysis(), forecast());

    assert.deepEqual(DEFAULT_PREDICTION_OPTIONS, { resolutionMinutes: 15, horizonMinutes: 1440 });
    assert.equal(result.power.length, 96);
    assert.deepEqual(result.power[1].horizon, {
        from: 1_000 + 15 * MINUTE,
        to: 1_000 + 30 * MINUTE,
    });
});

test("uses custom resolution and horizon options", () => {
    const customEngine = new PredictionEngine({ resolutionMinutes: 30, horizonMinutes: 120 });
    const result = customEngine.predict(analysis(), forecast());

    assert.equal(result.power.length, 4);
    assert.deepEqual(
        result.power.map(point => point.horizon),
        [
            { from: 1_000, to: 1_000 + 30 * MINUTE },
            { from: 1_000 + 30 * MINUTE, to: 1_000 + 60 * MINUTE },
            { from: 1_000 + 60 * MINUTE, to: 1_000 + 90 * MINUTE },
            { from: 1_000 + 90 * MINUTE, to: 1_000 + 120 * MINUTE },
        ],
    );
    assert.deepEqual(result.horizon, { from: 1_000, to: 1_000 + 120 * MINUTE });
});

test("rejects invalid prediction options", () => {
    assert.throws(
        () => new PredictionEngine({ resolutionMinutes: 0, horizonMinutes: 60 }),
        /resolutionMinutes must be greater than zero/,
    );
    assert.throws(
        () => new PredictionEngine({ resolutionMinutes: 15, horizonMinutes: 0 }),
        /horizonMinutes must be greater than zero/,
    );
    assert.throws(
        () => new PredictionEngine({ resolutionMinutes: 60, horizonMinutes: 30 }),
        /horizonMinutes must be at least resolutionMinutes/,
    );
});
