import { PredictionHorizon } from "./prediction";

interface TimestampedPoint {
    timestamp: number;
}

export class TimeSeriesMerger {
    public mergeTimestamps(...series: readonly (readonly TimestampedPoint[])[]): number[] {
        return [...new Set(series.flatMap(points => points.map(point => point.timestamp)).filter(Number.isFinite))].sort(
            (left, right) => left - right,
        );
    }

    public createIntervals(timestamps: readonly number[], validTo: number): PredictionHorizon[] {
        return timestamps.map((timestamp, index) => ({
            from: timestamp,
            to: Math.max(timestamp, timestamps[index + 1] ?? validTo),
        }));
    }
}
