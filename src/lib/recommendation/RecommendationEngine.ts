import {
    AnalysisResult,
    EvaluationResult,
    OptimizerInput,
    PredictionResult,
    RecommendationResult,
} from "../model";

export class RecommendationEngine {
    public recommend(
        input: OptimizerInput,
        analysis: AnalysisResult,
        prediction: PredictionResult,
        evaluation: EvaluationResult,
    ): RecommendationResult {
        void input;
        void analysis;
        void prediction;
        void evaluation;

        return {
            decision: {
                recommendation: "collecting data",
                confidencePercent: 0,
                allowDischarge: false,
                allowGridCharging: false,
            },
            explanation: [],
        };
    }
}
