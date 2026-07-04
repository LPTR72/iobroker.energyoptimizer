import { AnalysisResult, OptimizerInput, PredictionResult } from "../model";

export class PredictionEngine {
    public predict(input: OptimizerInput, analysis: AnalysisResult): PredictionResult {
        void input;
        void analysis;

        return {
            explanation: [],
        };
    }
}
