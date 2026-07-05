import type { Recommendation, RecommendationPriority } from "./optimization";
import type { SimulationRuntimeResult, SimulationWarning } from "./simulation";

export interface SimulationPublicationSnapshot {
    readonly generatedAt: number;
    readonly ready: boolean;
    readonly configuredSourcesCount: number;
    readonly validSourcesCount: number;
    readonly missingSourcesCount: number;
    readonly warningCount: number;
    readonly warnings: readonly SimulationWarning[];
    readonly recommendationCount: number;
    readonly recommendations: readonly Recommendation[];
    readonly best: Recommendation | null;
    readonly json: string;
}

const PRIORITY_RANK: Readonly<Record<RecommendationPriority, number>> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
};

export class SimulationPublicationMapper {
    public map(result: SimulationRuntimeResult): SimulationPublicationSnapshot {
        const recommendations = [...result.recommendations].sort((left, right) => this.compareRecommendations(left, right));
        const warnings = result.warnings
            .map(warning => ({ ...warning, missingSourceIds: [...warning.missingSourceIds].sort() }))
            .sort((left, right) =>
                this.compareText(left.code, right.code) ||
                this.compareText(left.message, right.message) ||
                this.compareText(left.missingSourceIds.join(","), right.missingSourceIds.join(",")),
            );
        const payload = {
            generatedAt: result.generatedAt,
            configuredSourcesCount: result.configuredSourcesCount,
            validSourcesCount: result.validSourcesCount,
            missingSourcesCount: result.missingSourcesCount,
            analysis: result.analysis,
            prediction: result.prediction,
            situations: result.situations,
            recommendations,
            warnings,
        };

        return {
            generatedAt: result.generatedAt,
            ready: result.missingSourcesCount === 0,
            configuredSourcesCount: result.configuredSourcesCount,
            validSourcesCount: result.validSourcesCount,
            missingSourcesCount: result.missingSourcesCount,
            warningCount: warnings.length,
            warnings,
            recommendationCount: recommendations.length,
            recommendations,
            best: recommendations[0] ?? null,
            json: JSON.stringify(payload),
        };
    }

    private compareRecommendations(left: Recommendation, right: Recommendation): number {
        return (
            PRIORITY_RANK[right.priority] - PRIORITY_RANK[left.priority] ||
            left.horizon.from - right.horizon.from ||
            left.horizon.to - right.horizon.to ||
            this.compareText(left.type, right.type) ||
            this.compareText(left.reason.code, right.reason.code) ||
            this.compareText(left.reason.description, right.reason.description) ||
            this.compareText(left.targetAssetIds?.join(",") ?? "", right.targetAssetIds?.join(",") ?? "")
        );
    }

    private compareText(left: string, right: string): number {
        return left < right ? -1 : left > right ? 1 : 0;
    }
}
