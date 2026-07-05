import type { EnergyAnalysis } from "./analysis";
import type { EnergyPrediction } from "./prediction";
import type { EnergySituation, Recommendation } from "./optimization";

export type SimulationWarningCode = "incomplete_source_data";

export interface SimulationWarning {
    readonly code: SimulationWarningCode;
    readonly message: string;
    readonly missingSourceIds: readonly string[];
}

export interface SimulationRuntimeResult {
    readonly generatedAt: number;
    readonly configuredSourcesCount: number;
    readonly validSourcesCount: number;
    readonly missingSourcesCount: number;
    readonly analysis: EnergyAnalysis;
    readonly prediction: EnergyPrediction;
    readonly situations: readonly EnergySituation[];
    readonly recommendations: readonly Recommendation[];
    readonly warnings: readonly SimulationWarning[];
}
