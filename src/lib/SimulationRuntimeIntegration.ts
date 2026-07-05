import type { EnergyOptimizerConfig } from "./config";
import type { RecommendationProjection, RecommendationProjectionMapper } from "./RecommendationProjection";
import type { SimulationPublicationMapper, SimulationPublicationSnapshot } from "./SimulationPublication";
import type { SimulationRuntimeResult } from "./simulation";

export interface SimulationRunner {
    simulate(config: EnergyOptimizerConfig): Promise<SimulationRuntimeResult>;
}

export interface SimulationPublicationWriter {
    writeSimulationPublication(
        snapshot: SimulationPublicationSnapshot,
        recommendation: RecommendationProjection,
    ): Promise<void>;
}

export class SimulationRuntimeIntegration {
    public constructor(
        private readonly simulationRuntime: SimulationRunner,
        private readonly publicationMapper: SimulationPublicationMapper,
        private readonly recommendationProjectionMapper: RecommendationProjectionMapper,
        private readonly publicationWriter: SimulationPublicationWriter,
    ) {}

    public async run(config: EnergyOptimizerConfig): Promise<SimulationPublicationSnapshot> {
        const result = await this.simulationRuntime.simulate(config);
        const snapshot = this.publicationMapper.map(result);
        const recommendation = this.recommendationProjectionMapper.map(snapshot);
        await this.publicationWriter.writeSimulationPublication(snapshot, recommendation);
        return snapshot;
    }
}
