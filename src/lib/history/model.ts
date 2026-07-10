export type HistoricalMetricType =
    | "power"
    | "energy_counter"
    | "state_of_charge"
    | "binary_state"
    | "temperature"
    | "price"
    | "generic_number";

export type HistoricalBucketResolution = "1m" | "5m" | "15m" | "60m" | "1d";

export type GenericNumberReducer = "average" | "minimum" | "maximum" | "sum" | "last";

export interface HistoricalInterval {
    readonly from: number;
    readonly to: number;
}

export interface HistoricalSample {
    readonly assetId: string;
    readonly metricType: HistoricalMetricType;
    readonly timestamp: number;
    readonly value: number;
    readonly sourceFreshnessTimestamp?: number;
}

export interface HistoryQualityMetadata {
    readonly expectedSampleCount: number;
    readonly validSampleCount: number;
    readonly rejectedSampleCount: number;
    readonly coverageRatio: number;
    readonly gapCount: number;
    readonly sourceFreshnessTimestamp?: number;
}

export interface PowerBucketValue {
    readonly average: number;
    readonly minimum: number;
    readonly maximum: number;
}

export interface EnergyCounterBucketValue {
    readonly opening: number;
    readonly closing: number;
    readonly delta: number;
    readonly resetCount: number;
}

export interface StateOfChargeBucketValue {
    readonly average: number;
    readonly minimum: number;
    readonly maximum: number;
    readonly last: number;
}

export interface BinaryStateBucketValue {
    readonly falseDurationMs: number;
    readonly trueDurationMs: number;
    readonly transitionCount: number;
    readonly first: 0 | 1;
    readonly last: 0 | 1;
}

export interface TemperatureBucketValue {
    readonly average: number;
    readonly minimum: number;
    readonly maximum: number;
}

export interface PriceBucketValue {
    readonly timeWeightedAverage: number;
    readonly minimum: number;
    readonly maximum: number;
}

export interface GenericNumberBucketValue {
    readonly reducer: GenericNumberReducer;
    readonly value: number;
}

export type HistoricalBucketValue =
    | PowerBucketValue
    | EnergyCounterBucketValue
    | StateOfChargeBucketValue
    | BinaryStateBucketValue
    | TemperatureBucketValue
    | PriceBucketValue
    | GenericNumberBucketValue;

export interface HistoricalBucket {
    readonly assetId: string;
    readonly metricType: HistoricalMetricType;
    readonly resolution: HistoricalBucketResolution;
    readonly interval: HistoricalInterval;
    readonly value: HistoricalBucketValue;
    readonly quality: HistoryQualityMetadata;
}

export const HISTORICAL_BUCKET_RESOLUTION_MS: Record<HistoricalBucketResolution, number> = {
    "1m": 60_000,
    "5m": 5 * 60_000,
    "15m": 15 * 60_000,
    "60m": 60 * 60_000,
    "1d": 24 * 60 * 60_000,
};

export const NEXT_HISTORICAL_BUCKET_RESOLUTION: Partial<
    Record<HistoricalBucketResolution, HistoricalBucketResolution>
> = {
    "1m": "5m",
    "5m": "15m",
    "15m": "60m",
    "60m": "1d",
};
