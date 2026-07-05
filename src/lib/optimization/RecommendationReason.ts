export type RecommendationReasonCode =
    | "pv_surplus"
    | "grid_import"
    | "grid_export"
    | "low_storage_level"
    | "high_storage_level"
    | "price_window"
    | "forecast";

export interface RecommendationReason {
    readonly code: RecommendationReasonCode;
    readonly description: string;
}
