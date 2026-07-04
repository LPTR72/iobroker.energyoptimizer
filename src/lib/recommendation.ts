import { EnergyAssetType } from "./model";
import { PredictionHorizon } from "./prediction";
import { EnergySituationType } from "./situation";

export type EnergyRecommendationType =
    | "charge_battery"
    | "discharge_battery"
    | "delay_consumption"
    | "increase_self_consumption"
    | "avoid_grid_import"
    | "avoid_grid_export"
    | "prepare_for_high_price"
    | "protect_battery";

export type EnergyRecommendationPriority = "low" | "medium" | "high" | "critical";

export interface EnergyRecommendation {
    type: EnergyRecommendationType;
    priority: EnergyRecommendationPriority;
    horizon: PredictionHorizon;
    reason: string;
    expectedBenefit?: string;
    relatedSituationTypes?: readonly EnergySituationType[];
    targetAssetTypes?: readonly EnergyAssetType[];
}
