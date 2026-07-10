import {
    DEFAULT_HISTORY_DAY_BOUNDARY_STRATEGY,
    GenericNumberReducer,
    HISTORICAL_BUCKET_RESOLUTION_MS,
    HistoricalBucket,
    HistoricalBucketResolution,
    HistoricalMetricType,
    HistoryDayBoundaryStrategy,
    NEXT_HISTORICAL_BUCKET_RESOLUTION,
} from "./model";
import { createBucketFromBuckets } from "./aggregation";

export interface HistoryAggregatorOptions {
    readonly genericNumberReducer?: GenericNumberReducer;
    readonly dayBoundaryStrategy?: HistoryDayBoundaryStrategy;
}

export class HistoryAggregator {
    private readonly genericNumberReducer?: GenericNumberReducer;
    private readonly dayBoundaryStrategy: HistoryDayBoundaryStrategy;

    public constructor(options: HistoryAggregatorOptions = {}) {
        this.genericNumberReducer = options.genericNumberReducer;
        this.dayBoundaryStrategy = options.dayBoundaryStrategy ?? DEFAULT_HISTORY_DAY_BOUNDARY_STRATEGY;
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

            const interval = targetInterval(bucket.interval.from, targetResolution, this.dayBoundaryStrategy);
            const key = groupKey(bucket.assetId, bucket.metricType, interval.from);
            const group = groups.get(key);

            if (group) {
                group.push(bucket);
            } else {
                groups.set(key, [bucket]);
            }
        }

        return [...groups.values()]
            .map(group => {
                const interval = targetInterval(group[0].interval.from, targetResolution, this.dayBoundaryStrategy);
                return createBucketFromBuckets(group, {
                    resolution: targetResolution,
                    interval,
                    genericNumberReducer: this.genericNumberReducer,
                });
            })
            .sort(compareBuckets);
    }
}

function targetInterval(
    timestamp: number,
    resolution: HistoricalBucketResolution,
    dayBoundaryStrategy: HistoryDayBoundaryStrategy,
): { readonly from: number; readonly to: number } {
    if (resolution !== "1d" || dayBoundaryStrategy === "rolling24h") {
        const from = floorToResolution(timestamp, HISTORICAL_BUCKET_RESOLUTION_MS[resolution]);
        return { from, to: from + HISTORICAL_BUCKET_RESOLUTION_MS[resolution] };
    }

    const fromDate = new Date(timestamp);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 1);
    return { from: fromDate.getTime(), to: toDate.getTime() };
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
