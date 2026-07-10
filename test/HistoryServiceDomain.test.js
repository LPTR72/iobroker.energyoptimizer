const assert = require("node:assert/strict");
const test = require("node:test");
const { HistoryAggregator, HistoryCollector } = require("../build/lib/history");

const MINUTE = 60_000;

function sample(metricType, timestamp, value, overrides = {}) {
    return {
        assetId: "asset-1",
        metricType,
        timestamp,
        value,
        ...overrides,
    };
}

test("collects deterministic 1-minute power buckets", () => {
    const collector = new HistoryCollector({ expectedSampleIntervalMs: 30_000 });
    const buckets = collector.collect([
        sample("power", 30_000, 300),
        sample("power", 0, 100),
        sample("power", 15_000, 200),
    ]);

    assert.equal(buckets.length, 1);
    assert.equal(buckets[0].resolution, "1m");
    assert.deepEqual(buckets[0].interval, { from: 0, to: MINUTE });
    assert.deepEqual(buckets[0].value, { average: 200, minimum: 100, maximum: 300 });
    assert.deepEqual(buckets[0].quality, {
        expectedSampleCount: 2,
        validSampleCount: 3,
        rejectedSampleCount: 0,
        coverageRatio: 1,
        gapCount: 0,
        sourceFreshnessTimestamp: undefined,
    });
});

test("tracks rejected samples and gaps", () => {
    const collector = new HistoryCollector({ expectedSampleIntervalMs: 20_000 });
    const buckets = collector.collect([sample("temperature", 0, 20), sample("temperature", 10_000, Number.NaN)]);

    assert.equal(buckets[0].quality.expectedSampleCount, 3);
    assert.equal(buckets[0].quality.validSampleCount, 1);
    assert.equal(buckets[0].quality.rejectedSampleCount, 1);
    assert.equal(buckets[0].quality.coverageRatio, 1 / 3);
    assert.equal(buckets[0].quality.gapCount, 2);
});

test("aggregates energy counters with reset-aware deltas", () => {
    const collector = new HistoryCollector();
    const buckets = collector.collect([
        sample("energy_counter", 0, 100),
        sample("energy_counter", 10_000, 130),
        sample("energy_counter", 20_000, 5),
        sample("energy_counter", 30_000, 15),
    ]);

    assert.deepEqual(buckets[0].value, {
        opening: 100,
        closing: 15,
        delta: 45,
        resetCount: 1,
    });
});

test("aggregates state of charge with average, bounds, and last value", () => {
    const collector = new HistoryCollector();
    const buckets = collector.collect([
        sample("state_of_charge", 0, 50),
        sample("state_of_charge", 10_000, 60),
        sample("state_of_charge", 20_000, 55),
    ]);

    assert.deepEqual(buckets[0].value, {
        average: 55,
        minimum: 50,
        maximum: 60,
        last: 55,
    });
});

test("aggregates binary state durations and transitions", () => {
    const collector = new HistoryCollector();
    const buckets = collector.collect([
        sample("binary_state", 0, 0),
        sample("binary_state", 10_000, 1),
        sample("binary_state", 40_000, 0),
    ]);

    assert.deepEqual(buckets[0].value, {
        falseDurationMs: 30_000,
        trueDurationMs: 30_000,
        transitionCount: 2,
        first: 0,
        last: 0,
    });
});

test("aggregates temperature values", () => {
    const collector = new HistoryCollector();
    const buckets = collector.collect([
        sample("temperature", 0, 20),
        sample("temperature", 10_000, 22),
        sample("temperature", 20_000, 18),
    ]);

    assert.deepEqual(buckets[0].value, { average: 20, minimum: 18, maximum: 22 });
});

test("aggregates prices with time weighting", () => {
    const collector = new HistoryCollector();
    const buckets = collector.collect([sample("price", 0, 10), sample("price", 30_000, 20)]);

    assert.deepEqual(buckets[0].value, {
        timeWeightedAverage: 15,
        minimum: 10,
        maximum: 20,
    });
});

test("requires an explicit reducer for generic numbers", () => {
    assert.throws(
        () => new HistoryCollector().collect([sample("generic_number", 0, 2)]),
        /generic_number aggregation requires an explicit reducer/,
    );

    const buckets = new HistoryCollector({ genericNumberReducer: "sum" }).collect([
        sample("generic_number", 0, 2),
        sample("generic_number", 10_000, 3),
    ]);

    assert.deepEqual(buckets[0].value, { reducer: "sum", value: 5 });
});

test("aggregates 1-minute buckets into 5-minute buckets only from the immediately preceding resolution", () => {
    const collector = new HistoryCollector();
    const oneMinuteBuckets = collector.collect([
        sample("power", 0, 100),
        sample("power", 1 * MINUTE, 200),
        sample("power", 2 * MINUTE, 300),
        sample("power", 3 * MINUTE, 400),
        sample("power", 4 * MINUTE, 500),
    ]);
    const aggregator = new HistoryAggregator();

    const fiveMinuteBuckets = aggregator.aggregate(oneMinuteBuckets, "5m");

    assert.equal(fiveMinuteBuckets.length, 1);
    assert.equal(fiveMinuteBuckets[0].resolution, "5m");
    assert.deepEqual(fiveMinuteBuckets[0].interval, { from: 0, to: 5 * MINUTE });
    assert.deepEqual(fiveMinuteBuckets[0].value, { average: 300, minimum: 100, maximum: 500 });
    assert.equal(fiveMinuteBuckets[0].quality.expectedSampleCount, 5);
    assert.equal(fiveMinuteBuckets[0].quality.validSampleCount, 5);
});

test("rejects aggregation that skips the previous resolution", () => {
    const collector = new HistoryCollector();
    const oneMinuteBuckets = collector.collect([sample("power", 0, 100)]);

    assert.throws(
        () => new HistoryAggregator().aggregate(oneMinuteBuckets, "15m"),
        /Cannot aggregate 1m buckets directly into 15m buckets/,
    );
});

test("aggregates binary transitions across bucket boundaries", () => {
    const collector = new HistoryCollector();
    const oneMinuteBuckets = collector.collect([
        sample("binary_state", 0, 0),
        sample("binary_state", 1 * MINUTE, 1),
        sample("binary_state", 2 * MINUTE, 1),
        sample("binary_state", 3 * MINUTE, 0),
        sample("binary_state", 4 * MINUTE, 0),
    ]);

    const fiveMinuteBuckets = new HistoryAggregator().aggregate(oneMinuteBuckets, "5m");

    assert.equal(fiveMinuteBuckets[0].value.transitionCount, 2);
    assert.equal(fiveMinuteBuckets[0].value.first, 0);
    assert.equal(fiveMinuteBuckets[0].value.last, 0);
});

test("rejects binary values that were not already interpreted as exactly zero or one", () => {
    const collector = new HistoryCollector({ expectedSampleIntervalMs: 10_000 });
    const buckets = collector.collect([
        sample("binary_state", 0, 0),
        sample("binary_state", 10_000, 1),
        sample("binary_state", 20_000, -1),
        sample("binary_state", 30_000, 0.5),
        sample("binary_state", 40_000, 2),
        sample("binary_state", 50_000, Number.NaN),
        sample("binary_state", 55_000, Number.POSITIVE_INFINITY),
    ]);

    assert.deepEqual(buckets[0].value, {
        falseDurationMs: 10_000,
        trueDurationMs: 50_000,
        transitionCount: 1,
        first: 0,
        last: 1,
    });
    assert.equal(buckets[0].quality.validSampleCount, 2);
    assert.equal(buckets[0].quality.rejectedSampleCount, 5);
});

test("aggregates the complete resolution chain into the default rolling 24-hour day", () => {
    const collector = new HistoryCollector();
    const aggregator = new HistoryAggregator();
    const oneMinuteBuckets = collector.collect(powerSamples(0, 24 * 60));
    const fiveMinuteBuckets = aggregator.aggregate(oneMinuteBuckets, "5m");
    const fifteenMinuteBuckets = aggregator.aggregate(fiveMinuteBuckets, "15m");
    const hourlyBuckets = aggregator.aggregate(fifteenMinuteBuckets, "60m");
    const dailyBuckets = aggregator.aggregate(hourlyBuckets, "1d");

    assert.equal(oneMinuteBuckets.length, 24 * 60);
    assert.equal(fiveMinuteBuckets.length, 24 * 12);
    assert.equal(fifteenMinuteBuckets.length, 24 * 4);
    assert.equal(hourlyBuckets.length, 24);
    assert.equal(dailyBuckets.length, 1);
    assert.deepEqual(dailyBuckets[0].interval, { from: 0, to: 24 * 60 * MINUTE });
    assert.deepEqual(dailyBuckets[0].value, { average: 100, minimum: 100, maximum: 100 });
});

test("uses local calendar boundaries for a daylight-saving 23-hour day", () => {
    const previousTimeZone = process.env.TZ;
    process.env.TZ = "Europe/Berlin";

    try {
        const from = new Date(2026, 2, 29, 0, 0, 0, 0).getTime();
        const to = new Date(2026, 2, 30, 0, 0, 0, 0).getTime();
        assert.equal(to - from, 23 * 60 * MINUTE);

        const collector = new HistoryCollector();
        const aggregator = new HistoryAggregator({ dayBoundaryStrategy: "calendarDayLocal" });
        const oneMinuteBuckets = collector.collect(powerSamples(from, 23 * 60));
        const fiveMinuteBuckets = aggregator.aggregate(oneMinuteBuckets, "5m");
        const fifteenMinuteBuckets = aggregator.aggregate(fiveMinuteBuckets, "15m");
        const hourlyBuckets = aggregator.aggregate(fifteenMinuteBuckets, "60m");
        const dailyBuckets = aggregator.aggregate(hourlyBuckets, "1d");

        assert.equal(hourlyBuckets.length, 23);
        assert.equal(dailyBuckets.length, 1);
        assert.deepEqual(dailyBuckets[0].interval, { from, to });
    } finally {
        if (previousTimeZone === undefined) {
            delete process.env.TZ;
        } else {
            process.env.TZ = previousTimeZone;
        }
    }
});

function powerSamples(from, minuteCount) {
    return Array.from({ length: minuteCount }, (_, index) => sample("power", from + index * MINUTE, 100));
}
