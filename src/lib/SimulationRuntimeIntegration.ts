import type { EnergyOptimizerConfig } from "./config";
import type { SimulationPublicationMapper, SimulationPublicationSnapshot } from "./SimulationPublication";
import type { SimulationRuntimeResult } from "./simulation";

export interface SimulationRunner {
    simulate(config: EnergyOptimizerConfig): Promise<SimulationRuntimeResult>;
}

export interface SimulationPublicationWriter {
    writeSimulationPublication(snapshot: SimulationPublicationSnapshot): Promise<void>;
}

export class SimulationRuntimeIntegration {
    public constructor(
        private readonly simulationRuntime: SimulationRunner,
        private readonly publicationMapper: SimulationPublicationMapper,
        private readonly publicationWriter: SimulationPublicationWriter,
    ) {}

    public async run(config: EnergyOptimizerConfig): Promise<SimulationPublicationSnapshot> {
        const result = await this.simulationRuntime.simulate(config);
        const snapshot = this.publicationMapper.map(result);
        await this.publicationWriter.writeSimulationPublication(snapshot);
        return snapshot;
    }
}
