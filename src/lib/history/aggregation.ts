import {
    BinaryStateBucketValue,
    EnergyCounterBucketValue,
    GenericNumberBucketValue,
    GenericNumberReducer,
    HISTORICAL_BUCKET_RESOLUTION_MS,
    HistoricalBucket,
    HistoricalBucketResolution,
    HistoricalBucketValue,
    HistoricalInterval,
    HistoricalMetricType,
    HistoricalSample,
    HistoryQualityMetadata,
    NEXT_HISTORICAL_BUCKET_RESOLUTION,
    PowerBucketValue,
    PriceBucketValue,
    StateOfChargeBucketValue,
    TemperatureBucketValue,
} from "./model";

interface BucketFromSamplesOptions {
    readonly resolution: HistoricalBucketResolution;
    readonly interval: HistoricalInterval;
    readonly expectedSampleIntervalMs: number;
    readonly genericNumberReducer?: GenericNumberReducer;
}

interface BucketFromBucketsOptions {
    readonly resolution: HistoricalBucketResolution;
    readonly interval: HistoricalInterval;
    readonly genericNumberReducer?: GenericNumberReducer;
}

interface ValidSample {
    readonly timestamp: number;
    readonly value: number;
    readonly sourceFreshnessTimestamp?: number;
}

export function createBucketFromSamples(
    samples: readonly HistoricalSample[],
    options: BucketFromSamplesOptions,
): HistoricalBucket {
    if (samples.length === 0) throw new Error("Cannot create a historical bucket without samples");

    const assetId = samples[0].assetId;
    const metricType = samples[0].metricType;
    for (const sample of samples) {
        if (sample.assetId !== assetId) throw new Error("All samples in a bucket must have the same assetId");
        if (sample.metricType !== metricType) throw new Error("All samples in a bucket must have the same metricType");
    }

    const sortedSamples = [...samples].sort(compareSamples);
    const validSamples = sortedSamples
        .filter(sample => isValidSample(sample, options.interval))
        .map(sample => ({
            timestamp: sample.timestamp,
            value: sample.value,
            sourceFreshnessTimestamp: sample.sourceFreshnessTimestamp,
        }));

    if (validSamples.length === 0) throw new Error("Cannot create a historical bucket without valid samples");

    return {
        assetId,
        metricType,
        resolution: options.resolution,
        interval: options.interval,
        value: aggregateSamples(metricType, validSamples, options.interval, options.genericNumberReducer),
        quality: qualityFromSamples(sortedSamples, validSamples, options.interval, options.expectedSampleIntervalMs),
    };
}

export function createBucketFromBuckets(
    buckets: readonly HistoricalBucket[],
    options: BucketFromBucketsOptions,
): HistoricalBucket {
    if (buckets.length === 0) throw new Error("Cannot aggregate historical buckets without input buckets");

    const sortedBuckets = [...buckets].sort(compareBuckets);
    const assetId = sortedBuckets[0].assetId;
    const metricType = sortedBuckets[0].metricType;
    const sourceResolution = sortedBuckets[0].resolution;
    const expectedResolution = previousResolution(options.resolution);

    if (sourceResolution !== expectedResolution) {
        throw new Error(`Cannot aggregate ${sourceResolution} buckets directly into ${options.resolution} buckets`);
    }

    for (const bucket of sortedBuckets) {
        if (bucket.assetId !== assetId) throw new Error("All buckets must have the same assetId");
        if (bucket.metricType !== metricType) throw new Error("All buckets must have the same metricType");
        if (bucket.resolution !== sourceResolution) throw new Error("All buckets must have the same source resolution");
        if (bucket.interval.from < options.interval.from || bucket.interval.to > options.interval.to) {
            throw new Error("All source buckets must be contained in the target interval");
        }
    }

    return {
        assetId,
        metricType,
        resolution: options.resolution,
        interval: options.interval,
        value: aggregateBuckets(metricType, sortedBuckets, options.genericNumberReducer),
        quality: qualityFromBuckets(sortedBuckets, options.interval),
    };
}

function aggregateSamples(
    metricType: HistoricalMetricType,
    samples: readonly ValidSample[],
    interval: HistoricalInterval,
    genericNumberReducer?: GenericNumberReducer,
): HistoricalBucketValue {
    const values = samples.map(sample => sample.value);

    switch (metricType) {
        case "power":
            return averageMinimumMaximum(values);
        case "energy_counter":
            return aggregateEnergyCounterSamples(samples);
        case "state_of_charge":
            return { ...averageMinimumMaximum(values), last: samples[samples.length - 1].value };
        case "binary_state":
            return aggregateBinaryStateSamples(samples, interval);
        case "temperature":
            return averageMinimumMaximum(values);
        case "price":
            return aggregatePriceSamples(samples, interval);
        case "generic_number":
            return aggregateGenericNumbers(values, genericNumberReducer);
    }
}

function aggregateBuckets(
    metricType: HistoricalMetricType,
    buckets: readonly HistoricalBucket[],
    genericNumberReducer?: GenericNumberReducer,
): HistoricalBucketValue {
    switch (metricType) {
        case "power":
            return aggregateAverageMinimumMaximumBuckets(buckets, value => (value as PowerBucketValue).average);
        case "energy_counter":
            return aggregateEnergyCounterBuckets(buckets);
        case "state_of_charge":
            return aggregateStateOfChargeBuckets(buckets);
        case "binary_state":
            return aggregateBinaryStateBuckets(buckets);
        case "temperature":
            return aggregateAverageMinimumMaximumBuckets(buckets, value => (value as TemperatureBucketValue).average);
        case "price":
            return aggregatePriceBuckets(buckets);
        case "generic_number":
            return aggregateGenericBuckets(buckets, genericNumberReducer);
    }
}

function averageMinimumMaximum(values: readonly number[]): PowerBucketValue {
    return {
        average: sum(values) / values.length,
        minimum: Math.min(...values),
        maximum: Math.max(...values),
    };
}

function aggregateEnergyCounterSamples(samples: readonly ValidSample[]): EnergyCounterBucketValue {
    let delta = 0;
    let resetCount = 0;

    for (let index = 1; index < samples.length; index++) {
        const previous = samples[index - 1].value;
        const current = samples[index].value;
        if (current >= previous) {
            delta += current - previous;
        } else {
            resetCount++;
            delta += Math.max(0, current);
        }
    }

    return {
        opening: samples[0].value,
        closing: samples[samples.length - 1].value,
        delta,
        resetCount,
    };
}

function aggregateBinaryStateSamples(samples: readonly ValidSample[], interval: HistoricalInterval): BinaryStateBucketValue {
    let falseDurationMs = 0;
    let trueDurationMs = 0;
    let transitionCount = 0;

    for (let index = 0; index < samples.length; index++) {
        const current = normalizeBinary(samples[index].value);
        const segmentStart = Math.max(interval.from, samples[index].timestamp);
        const segmentEnd = Math.min(interval.to, samples[index + 1]?.timestamp ?? interval.to);
        const duration = Math.max(0, segmentEnd - segmentStart);

        if (current === 1) {
            trueDurationMs += duration;
        } else {
            falseDurationMs += duration;
        }

        if (index > 0 && normalizeBinary(samples[index - 1].value) !== current) transitionCount++;
    }

    return {
        falseDurationMs,
        trueDurationMs,
        transitionCount,
        first: normalizeBinary(samples[0].value),
        last: normalizeBinary(samples[samples.length - 1].value),
    };
}

function aggregatePriceSamples(samples: readonly ValidSample[], interval: HistoricalInterval): PriceBucketValue {
    return {
        timeWeightedAverage: timeWeightedAverage(samples, interval),
        minimum: Math.min(...samples.map(sample => sample.value)),
        maximum: Math.max(...samples.map(sample => sample.value)),
    };
}

function aggregateGenericNumbers(
    values: readonly number[],
    genericNumberReducer: GenericNumberReducer | undefined,
): GenericNumberBucketValue {
    if (!genericNumberReducer) throw new Error("generic_number aggregation requires an explicit reducer");

    return {
        reducer: genericNumberReducer,
        value: reduceGeneric(values, genericNumberReducer),
    };
}

function aggregateAverageMinimumMaximumBuckets(
    buckets: readonly HistoricalBucket[],
    averageValue: (value: HistoricalBucketValue) => number,
): PowerBucketValue {
    const weightedAverage =
        sum(buckets.map(bucket => averageValue(bucket.value) * duration(bucket.interval))) /
        sum(buckets.map(bucket => duration(bucket.interval)));
    const values = buckets.map(bucket => bucket.value as PowerBucketValue);

    return {
        average: weightedAverage,
        minimum: Math.min(...values.map(value => value.minimum)),
        maximum: Math.max(...values.map(value => value.maximum)),
    };
}

function aggregateEnergyCounterBuckets(buckets: readonly HistoricalBucket[]): EnergyCounterBucketValue {
    const values = buckets.map(bucket => bucket.value as EnergyCounterBucketValue);

    return {
        opening: values[0].opening,
        closing: values[values.length - 1].closing,
        delta: sum(values.map(value => value.delta)),
        resetCount: sum(values.map(value => value.resetCount)),
    };
}

function aggregateStateOfChargeBuckets(buckets: readonly HistoricalBucket[]): StateOfChargeBucketValue {
    const averageMinimumMaximum = aggregateAverageMinimumMaximumBuckets(
        buckets,
        value => (value as StateOfChargeBucketValue).average,
    );
    const values = buckets.map(bucket => bucket.value as StateOfChargeBucketValue);

    return {
        ...averageMinimumMaximum,
        last: values[values.length - 1].last,
    };
}

function aggregateBinaryStateBuckets(buckets: readonly HistoricalBucket[]): BinaryStateBucketValue {
    const values = buckets.map(bucket => bucket.value as BinaryStateBucketValue);
    let transitionCount = sum(values.map(value => value.transitionCount));

    for (let index = 1; index < values.length; index++) {
        if (values[index - 1].last !== values[index].first) transitionCount++;
    }

    return {
        falseDurationMs: sum(values.map(value => value.falseDurationMs)),
        trueDurationMs: sum(values.map(value => value.trueDurationMs)),
        transitionCount,
        first: values[0].first,
        last: values[values.length - 1].last,
    };
}

function aggregatePriceBuckets(buckets: readonly HistoricalBucket[]): PriceBucketValue {
    const values = buckets.map(bucket => bucket.value as PriceBucketValue);

    return {
        timeWeightedAverage:
            sum(buckets.map((bucket, index) => values[index].timeWeightedAverage * duration(bucket.interval))) /
            sum(buckets.map(bucket => duration(bucket.interval))),
        minimum: Math.min(...values.map(value => value.minimum)),
        maximum: Math.max(...values.map(value => value.maximum)),
    };
}

function aggregateGenericBuckets(
    buckets: readonly HistoricalBucket[],
    genericNumberReducer: GenericNumberReducer | undefined,
): GenericNumberBucketValue {
    const reducer = genericNumberReducer ?? (buckets[0].value as GenericNumberBucketValue).reducer;
    const values = buckets.map(bucket => bucket.value as GenericNumberBucketValue);

    for (const value of values) {
        if (value.reducer !== reducer) throw new Error("All generic_number buckets must use the same reducer");
    }

    return {
        reducer,
        value: reduceGeneric(
            values.map(value => value.value),
            reducer,
        ),
    };
}

function qualityFromSamples(
    allSamples: readonly HistoricalSample[],
    validSamples: readonly ValidSample[],
    interval: HistoricalInterval,
    expectedSampleIntervalMs: number,
): HistoryQualityMetadata {
    const expectedSampleCount = Math.max(1, Math.ceil(duration(interval) / expectedSampleIntervalMs));
    const coverageRatio = Math.min(1, validSamples.length / expectedSampleCount);

    return {
        expectedSampleCount,
        validSampleCount: validSamples.length,
        rejectedSampleCount: allSamples.length - validSamples.length,
        coverageRatio,
        gapCount: Math.max(0, expectedSampleCount - validSamples.length),
        sourceFreshnessTimestamp: latestFreshness(validSamples),
    };
}

function qualityFromBuckets(buckets: readonly HistoricalBucket[], interval: HistoricalInterval): HistoryQualityMetadata {
    const coveredDuration = sum(buckets.map(bucket => duration(bucket.interval) * bucket.quality.coverageRatio));
    const expectedBucketCount = Math.max(1, duration(interval) / HISTORICAL_BUCKET_RESOLUTION_MS[buckets[0].resolution]);

    return {
        expectedSampleCount: sum(buckets.map(bucket => bucket.quality.expectedSampleCount)),
        validSampleCount: sum(buckets.map(bucket => bucket.quality.validSampleCount)),
        rejectedSampleCount: sum(buckets.map(bucket => bucket.quality.rejectedSampleCount)),
        coverageRatio: Math.min(1, coveredDuration / duration(interval)),
        gapCount: Math.max(0, Math.round(expectedBucketCount - buckets.length)) + sum(buckets.map(bucket => bucket.quality.gapCount)),
        sourceFreshnessTimestamp: latestFreshness(buckets.map(bucket => bucket.quality)),
    };
}

function isValidSample(sample: HistoricalSample, interval: HistoricalInterval): boolean {
    return (
        sample.timestamp >= interval.from &&
        sample.timestamp < interval.to &&
        Number.isFinite(sample.timestamp) &&
        Number.isFinite(sample.value)
    );
}

function timeWeightedAverage(samples: readonly ValidSample[], interval: HistoricalInterval): number {
    let weightedSum = 0;
    let totalDuration = 0;

    for (let index = 0; index < samples.length; index++) {
        const segmentStart = Math.max(interval.from, samples[index].timestamp);
        const segmentEnd = Math.min(interval.to, samples[index + 1]?.timestamp ?? interval.to);
        const segmentDuration = Math.max(0, segmentEnd - segmentStart);
        weightedSum += samples[index].value * segmentDuration;
        totalDuration += segmentDuration;
    }

    return totalDuration > 0 ? weightedSum / totalDuration : samples[samples.length - 1].value;
}

function reduceGeneric(values: readonly number[], reducer: GenericNumberReducer): number {
    switch (reducer) {
        case "average":
            return sum(values) / values.length;
        case "minimum":
            return Math.min(...values);
        case "maximum":
            return Math.max(...values);
        case "sum":
            return sum(values);
        case "last":
            return values[values.length - 1];
    }
}

function previousResolution(resolution: HistoricalBucketResolution): HistoricalBucketResolution {
    const previous = Object.entries(NEXT_HISTORICAL_BUCKET_RESOLUTION).find(([, next]) => next === resolution)?.[0];
    if (!previous) throw new Error(`${resolution} is not an aggregate resolution`);
    return previous as HistoricalBucketResolution;
}

function compareSamples(left: HistoricalSample, right: HistoricalSample): number {
    return left.timestamp - right.timestamp || left.assetId.localeCompare(right.assetId) || left.metricType.localeCompare(right.metricType);
}

function compareBuckets(left: HistoricalBucket, right: HistoricalBucket): number {
    return left.interval.from - right.interval.from || left.interval.to - right.interval.to;
}

function normalizeBinary(value: number): 0 | 1 {
    return value > 0 ? 1 : 0;
}

function duration(interval: HistoricalInterval): number {
    return interval.to - interval.from;
}

function sum(values: readonly number[]): number {
    return values.reduce((total, value) => total + value, 0);
}

function latestFreshness(values: readonly { readonly sourceFreshnessTimestamp?: number }[]): number | undefined {
    const timestamps = values
        .map(value => value.sourceFreshnessTimestamp)
        .filter((timestamp): timestamp is number => timestamp !== undefined && Number.isFinite(timestamp));
    return timestamps.length ? Math.max(...timestamps) : undefined;
}
