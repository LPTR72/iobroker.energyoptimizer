import type { SimulationPublicationSnapshot } from "./SimulationPublication";

export interface RecommendationProjection {
    readonly available: boolean;
    readonly count: number;
    readonly bestType: string;
    readonly bestPriority: string;
    readonly bestReason: string;
    readonly bestValidFrom: number;
    readonly bestValidTo: number;
}

export class RecommendationProjectionMapper {
    public map(snapshot: SimulationPublicationSnapshot): RecommendationProjection {
        if (!snapshot.ready || !snapshot.best) {
            return {
                available: false,
                count: 0,
                bestType: "",
                bestPriority: "",
                bestReason: "",
                bestValidFrom: 0,
                bestValidTo: 0,
            };
        }

        return {
            available: true,
            count: snapshot.recommendationCount,
            bestType: snapshot.best.type,
            bestPriority: snapshot.best.priority,
            bestReason: snapshot.best.reason.description,
            bestValidFrom: snapshot.best.horizon.from,
            bestValidTo: snapshot.best.horizon.to,
        };
    }
}
