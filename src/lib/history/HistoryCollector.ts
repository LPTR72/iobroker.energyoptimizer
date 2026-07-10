import {
    GenericNumberReducer,
    HISTORICAL_BUCKET_RESOLUTION_MS,
    HistoricalBucket,
    HistoricalMetricType,
    HistoricalSample,
} from "./model";
import { createBucketFromSamples } from "./aggregation";

export interface HistoryCollectorOptions {
    readonly expectedSampleIntervalMs?: number;
    readonly genericNumberReducer?: GenericNumberReducer;
}

export class HistoryCollector {
    private readonly expectedSampleIntervalMs: number;
    private readonly genericNumberReducer?: GenericNumberReducer;

    public constructor(options: HistoryCollectorOptions = {}) {
        if (options.expectedSampleIntervalMs !== undefined && options.expectedSampleIntervalMs <= 0) {
            throw new Error("expectedSampleIntervalMs must be greater than zero");
        }

        this.expectedSampleIntervalMs = options.expectedSampleIntervalMs ?? HISTORICAL_BUCKET_RESOLUTION_MS["1m"];
        this.genericNumberReducer = options.genericNumberReducer;
    }

    public collect(samples: readonly HistoricalSample[]): HistoricalBucket[] {
        const groups = new Map<string, HistoricalSample[]>();

        for (const sample of samples) {
            if (!Number.isFinite(sample.timestamp)) continue;

            const bucketStart = floorToResolution(sample.timestamp, HISTORICAL_BUCKET_RESOLUTION_MS["1m"]);
            const key = groupKey(sample.assetId, sample.metricType, bucketStart);
            const group = groups.get(key);

            if (group) {
                group.push(sample);
            } else {
                groups.set(key, [sample]);
            }
        }

        return [...groups.values()]
            .map(group =>
                createBucketFromSamples(group, {
                    resolution: "1m",
                    interval: {
                        from: floorToResolution(group[0].timestamp, HISTORICAL_BUCKET_RESOLUTION_MS["1m"]),
                        to: floorToResolution(group[0].timestamp, HISTORICAL_BUCKET_RESOLUTION_MS["1m"]) + HISTORICAL_BUCKET_RESOLUTION_MS["1m"],
                    },
                    expectedSampleIntervalMs: this.expectedSampleIntervalMs,
                    genericNumberReducer: this.genericNumberReducer,
                }),
            )
            .sort(compareBuckets);
    }
}

function floorToResolution(timestamp: number, resolutionMs: number): number {
    return Math.floor(timestamp / resolutionMs) * resolutionMs;
}

function groupKey(assetId: string, metricType: HistoricalMetricType, bucketStart: number): string {
    return `${assetId}\u0000${metricType}\u0000${bucketStart}`;
}

function compareBuckets(left: HistoricalBucket, right: HistoricalBucket): number {
    return (
        left.interval.from - right.interval.from ||
        left.interval.to - right.interval.to ||
        left.assetId.localeCompare(right.assetId) ||
        left.metricType.localeCompare(right.metricType)
    );
}
