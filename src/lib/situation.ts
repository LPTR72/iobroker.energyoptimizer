import { PredictionHorizon } from "./prediction";

export type EnergySituationType =
    | "pv_surplus"
    | "grid_import"
    | "grid_export"
    | "battery_low"
    | "battery_high"
    | "battery_full_soon"
    | "high_price_period"
    | "cheap_price_period"
    | "forecast_uncertain";

export type EnergySituationSeverity = "info" | "warning" | "critical";

export interface EnergySituation {
    type: EnergySituationType;
    severity: EnergySituationSeverity;
    horizon: PredictionHorizon;
    confidencePercent?: number;
    message?: string;
    relatedAssetIds?: readonly string[];
}
