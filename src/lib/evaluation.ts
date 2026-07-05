export interface EvaluationOptions {
    /** Smallest absolute power considered meaningful for situation detection. */
    readonly minimumRelevantPowerW: number;
    readonly lowBatterySocPercent: number;
    readonly highBatterySocPercent: number;
    readonly fullBatterySocPercent: number;
    /** Deployment-specific threshold; the default is a placeholder/demo value, not a recommendation. */
    readonly cheapPriceCtPerKWh: number;
    /** Deployment-specific threshold; the default is a placeholder/demo value, not a recommendation. */
    readonly highPriceCtPerKWh: number;
}
