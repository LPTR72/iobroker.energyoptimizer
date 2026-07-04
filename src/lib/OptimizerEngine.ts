import { OptimizerDecision, OptimizerInput } from "./model";

export class OptimizerEngine {
    public calculate(input: OptimizerInput): OptimizerDecision {
        void input;

        return {
            recommendation: "collecting data",
            confidencePercent: 0,
            allowDischarge: false,
            allowGridCharging: false,
        };
    }
}
