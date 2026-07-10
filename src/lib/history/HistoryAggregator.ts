import {
    GenericNumberReducer,
    HISTORICAL_BUCKET_RESOLUTION_MS,
    HistoricalBucket,
    HistoricalBucketResolution,
    HistoricalMetricType,
    NEXT_HISTORICAL_BUCKET_RESOLUTION,
} from "./model";
import { createBucketFromBuckets } from "./aggregation";

export interface HistoryAggregatorOptions {
    readonly genericNumberReducer?: GenericNumberReducer;
}

export class HistoryAggregator {
    private readonly genericNumberReducer?: GenericNumberReducer;

    public constructor(options: HistoryAggregatorOptions = {}) {
        this.genericNumberReducer = options.genericNumberReducer;
    }

    public aggregate(
        buckets: readonly HistoricalBucket[],
        targetResolution: HistoricalBucketResolution,
    ): HistoricalBucket[] {
        if (targetResolution === "1m") throw new Error("1m buckets must be collected from live samples");

        const sourceResolution = previousResolution(targetResolution);
        const groups = new Map<string, HistoricalBucket[]>();

        for (const bucket of buckets) {
            if (bucket.resolution !== sourceResolution) {
                throw new Error(`Cannot aggregate ${bucket.resolution} buckets directly into ${targetResolution} buckets`);
            }

            const bucketStart = floorToResolution(bucket.interval.from, HISTORICAL_BUCKET_RESOLUTION_MS[targetResolution]);
            const key = groupKey(bucket.assetId, bucket.metricType, bucketStart);
            const group = groups.get(key);

            if (group) {
                group.push(bucket);
            } else {
                groups.set(key, [bucket]);
            }
        }

        return [...groups.values()]
            .map(group => {
                const bucketStart = floorToResolution(group[0].interval.from, HISTORICAL_BUCKET_RESOLUTION_MS[targetResolution]);
                return createBucketFromBuckets(group, {
                    resolution: targetResolution,
                    interval: {
                        from: bucketStart,
                        to: bucketStart + HISTORICAL_BUCKET_RESOLUTION_MS[targetResolution],
                    },
                    genericNumberReducer: this.genericNumberReducer,
                });
            })
            .sort(compareBuckets);
    }
}

function previousResolution(resolution: HistoricalBucketResolution): HistoricalBucketResolution {
    const previous = Object.entries(NEXT_HISTORICAL_BUCKET_RESOLUTION).find(([, next]) => next === resolution)?.[0];
    if (!previous) throw new Error(`${resolution} is not an aggregate resolution`);
    return previous as HistoricalBucketResolution;
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
