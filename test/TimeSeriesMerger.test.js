const assert = require("node:assert/strict");
const test = require("node:test");
const { TimeSeriesMerger } = require("../build/lib/TimeSeriesMerger");

const merger = new TimeSeriesMerger();

test("merges PV and consumption timestamps", () => {
    const timestamps = merger.mergeTimestamps([{ timestamp: 1000 }], [{ timestamp: 2000 }]);

    assert.deepEqual(timestamps, [1000, 2000]);
});

test("removes duplicate timestamps", () => {
    const timestamps = merger.mergeTimestamps(
        [{ timestamp: 1000 }, { timestamp: 2000 }],
        [{ timestamp: 1000 }],
    );

    assert.deepEqual(timestamps, [1000, 2000]);
});

test("sorts timestamps ascending", () => {
    const timestamps = merger.mergeTimestamps([{ timestamp: 3000 }, { timestamp: 1000 }], [{ timestamp: 2000 }]);

    assert.deepEqual(timestamps, [1000, 2000, 3000]);
});

test("ignores invalid timestamps", () => {
    const timestamps = merger.mergeTimestamps([
        { timestamp: Number.NaN },
        { timestamp: Number.POSITIVE_INFINITY },
        { timestamp: 1000 },
    ]);

    assert.deepEqual(timestamps, [1000]);
});

test("creates intervals ending at the next timestamp", () => {
    const intervals = merger.createIntervals([1000, 2000, 3000], 4000);

    assert.deepEqual(intervals[0], { from: 1000, to: 2000 });
    assert.deepEqual(intervals[1], { from: 2000, to: 3000 });
});

test("ends the last interval at validTo", () => {
    const intervals = merger.createIntervals([1000, 2000], 3000);

    assert.deepEqual(intervals[1], { from: 2000, to: 3000 });
});
