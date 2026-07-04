const assert = require("node:assert/strict");
const test = require("node:test");

class DummyForecastProvider {
    providerType = "static";

    constructor(forecast, warnings = []) {
        this.forecast = forecast;
        this.warnings = warnings;
    }

    async getForecast() {
        return {
            providerType: this.providerType,
            generatedAt: this.forecast.generatedAt,
            forecast: this.forecast,
            warnings: this.warnings,
        };
    }
}

function createForecast(overrides = {}) {
    return {
        generatedAt: 1_720_000_000_000,
        validFrom: 1_720_000_000_000,
        validTo: 1_720_003_600_000,
        pvPower: [{ timestamp: 1_720_000_000_000, powerW: 1200 }],
        consumptionPower: [{ timestamp: 1_720_000_000_000, powerW: 800 }],
        gridPrice: [{ timestamp: 1_720_000_000_000, priceCtPerKWh: 28.5 }],
        weather: [{ timestamp: 1_720_000_000_000, temperatureC: 21, cloudCoverPercent: 20 }],
        ...overrides,
    };
}

test("a forecast provider returns a valid energy forecast", async () => {
    const result = await new DummyForecastProvider(createForecast()).getForecast();

    assert.equal(result.forecast.pvPower[0].powerW, 1200);
    assert.equal(result.forecast.consumptionPower[0].powerW, 800);
    assert.equal(result.forecast.gridPrice[0].priceCtPerKWh, 28.5);
    assert.equal(result.forecast.weather[0].temperatureC, 21);
});

test("empty forecast arrays are allowed", async () => {
    const forecast = createForecast({ pvPower: [], consumptionPower: [], gridPrice: [], weather: [] });
    const result = await new DummyForecastProvider(forecast).getForecast();

    assert.deepEqual(result.forecast.pvPower, []);
    assert.deepEqual(result.forecast.consumptionPower, []);
    assert.deepEqual(result.forecast.gridPrice, []);
    assert.deepEqual(result.forecast.weather, []);
});

test("forecast timestamps describe a valid time range", async () => {
    const result = await new DummyForecastProvider(createForecast()).getForecast();

    assert.equal(result.generatedAt, result.forecast.generatedAt);
    assert.ok(result.forecast.generatedAt <= result.forecast.validFrom);
    assert.ok(result.forecast.validFrom <= result.forecast.validTo);
});

test("warnings are returned without failing the provider", async () => {
    const result = await new DummyForecastProvider(createForecast(), ["Partial weather data"]).getForecast();

    assert.deepEqual(result.warnings, ["Partial weather data"]);
    assert.ok(result.forecast);
});

test("provider type remains stable", async () => {
    const provider = new DummyForecastProvider(createForecast());
    const firstResult = await provider.getForecast();
    const secondResult = await provider.getForecast();

    assert.equal(provider.providerType, "static");
    assert.equal(firstResult.providerType, provider.providerType);
    assert.equal(secondResult.providerType, provider.providerType);
});
