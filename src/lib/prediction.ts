export interface PredictionHorizon {
    from: number;
    to: number;
}

export interface PredictionOptions {
    readonly resolutionMinutes: number;
    readonly horizonMinutes: number;
}

export interface PowerPrediction {
    horizon: PredictionHorizon;
    expectedPvPowerW: number;
    expectedConsumptionPowerW: number;
    expectedSurplusW: number;
    expectedDeficitW: number;
}

export interface PricePrediction {
    horizon: PredictionHorizon;
    expectedGridPriceCtPerKWh?: number;
}

export interface BatteryPrediction {
    horizon: PredictionHorizon;
    expectedSocPercent?: number;
    expectedChargePowerW?: number;
    expectedDischargePowerW?: number;
}

export interface PredictionWarning {
    code: string;
    message: string;
}

export interface EnergyPrediction {
    generatedAt: number;
    horizon: PredictionHorizon;
    power: readonly PowerPrediction[];
    prices: readonly PricePrediction[];
    battery: readonly BatteryPrediction[];
    warnings: readonly PredictionWarning[];
}
