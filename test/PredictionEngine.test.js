const assert = require("node:assert/strict");
const test = require("node:test");
const { PredictionEngine } = require("../build/lib/PredictionEngine");

const engine = new PredictionEngine();

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
        validFrom: 1000,
        validTo: 3000,
        pvPower: [{ timestamp: 1000, powerW: 1200 }],
        consumptionPower: [{ timestamp: 1000, powerW: 800 }],
        gridPrice: [],
        weather: [],
        ...overrides,
    };
}

test("maps normal PV and consumption forecasts", () => {
    const result = engine.predict(analysis(), forecast());

    assert.equal(result.generatedAt, 100);
    assert.deepEqual(result.horizon, { from: 1000, to: 3000 });
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

    assert.equal(result.power.length, 1);
    assert.deepEqual(result.power[0].horizon, { from: 1000, to: 3000 });
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
    assert.deepEqual(result.prices[0].horizon, { from: 1000, to: 3000 });
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
            pvPower: [{ timestamp: 1000, powerW: 900 }],
            consumptionPower: [{ timestamp: 2000, powerW: 600 }],
        }),
    );

    assert.deepEqual(
        result.warnings.map(warning => warning.code).sort(),
        ["missing_consumption_forecast", "missing_pv_forecast"],
    );
    assert.equal(result.power.length, 2);
});
