import type { EnergyAssetType } from "../model";
import type { PredictionHorizon } from "../prediction";
import type { EnergySituationType } from "./EnergySituation";
import type { RecommendationPriority } from "./RecommendationPriority";
import type { RecommendationReason } from "./RecommendationReason";

export type RecommendationType =
    | "charge_storage"
    | "discharge_storage"
    | "shift_consumption"
    | "increase_self_consumption"
    | "reduce_grid_import"
    | "avoid_feed_in"
    | "prepare_for_price_window"
    | "protect_storage";

export interface Recommendation {
    readonly type: RecommendationType;
    readonly priority: RecommendationPriority;
    readonly horizon: Readonly<PredictionHorizon>;
    readonly reason: RecommendationReason;
    readonly expectedBenefit?: string;
    readonly relatedSituationTypes?: readonly EnergySituationType[];
    readonly targetAssetIds?: readonly string[];
    readonly targetAssetTypes?: readonly EnergyAssetType[];
}
