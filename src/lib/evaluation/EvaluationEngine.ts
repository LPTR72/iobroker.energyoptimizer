import { AnalysisResult, EvaluationResult, OptimizerInput, PredictionResult } from "../model";

export class EvaluationEngine {
    public evaluate(
        input: OptimizerInput,
        analysis: AnalysisResult,
        prediction: PredictionResult,
    ): EvaluationResult {
        void input;
        void analysis;
        void prediction;

        return {
            risks: [],
            explanation: [],
        };
    }
}
