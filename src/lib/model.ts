import type { STATE_IDS } from "./states";

export interface LiveEnergyData {
    gridImportPowerW?: number;
    gridExportPowerW?: number;
    houseConsumptionPowerW?: number;
    pvPowerW?: number;
    batterySoc?: number;
    batteryPowerW?: number;
}

export interface TariffConfig {
    workPriceCt: number;
    basePriceMonthlyEuro: number;
}

export interface OptimizerResult {
    recommendation: string;
}

export interface GridState {
    importPowerW?: number;
    exportPowerW?: number;
}

export interface PvState {
    id?: string;
    name?: string;
    productionPowerW?: number;
}

export interface BatteryState {
    id: string;
    name?: string;
    socPercent?: number;
    powerW?: number;
    capacityWh?: number;
}

export interface HouseState {
    consumptionPowerW?: number;
}

export interface EnergySystemState {
    grid: GridState;
    /** Aggregated/default PV view. */
    pv: PvState;
    /** Preferred model for multiple PV systems. */
    pvSystems: readonly PvState[];
    /** Legacy/default single-battery view retained for compatibility. */
    battery: BatteryState;
    /** Preferred model for multiple battery systems. */
    batteries: readonly BatteryState[];
    house: HouseState;
}

export type GridOptimizationMode = "zeroExport" | "baseLoadCoverage" | "selfConsumption" | "costOptimized";

export interface GridOptimizationPreferences {
    mode: GridOptimizationMode;
    targetGridImportW?: number;
    targetBaseLoadW?: number;
    allowedExportW?: number;
    deadbandW?: number;
}

export interface OptimizationGoals {
    maximizeSelfConsumption: boolean;
    minimizeGridCosts: boolean;
    preserveBatteryForEvening: boolean;
    emergencyReservePercent: number;
    minimizeBatteryCycles: boolean;
    gridOptimization: GridOptimizationPreferences;
}

export interface OptimizerInput {
    system: EnergySystemState;
    tariff: TariffConfig;
    goals: OptimizationGoals;
    weatherForecast?: WeatherForecast;
}

export interface OptimizerDecision {
    recommendation: string;
    targetBatterySocPercent?: number;
    allowDischarge?: boolean;
    allowGridCharging?: boolean;
    confidencePercent?: number;
}

export interface AnalysisResult {
    currentSurplusPowerW?: number;
    isImportingFromGrid?: boolean;
    isExportingToGrid?: boolean;
    batteryBelowReserve?: boolean;
    explanation: readonly string[];
}

export interface PredictionResult {
    pvPrediction?: PvPrediction;
    explanation: readonly string[];
}

export interface EvaluationResult {
    score?: number;
    risks: readonly string[];
    explanation: readonly string[];
}

export interface RecommendationResult {
    decision: OptimizerDecision;
    explanation: readonly string[];
}

export type NumericLiveStateId = (typeof STATE_IDS.live)[keyof typeof STATE_IDS.live];

export interface IStateProvider {
    readNumericState(sourceId: string | undefined): Promise<number | undefined>;
}

export interface WeatherForecastPoint {
    timestamp: number;
    temperatureC?: number;
    cloudCoverPercent?: number;
    precipitationProbabilityPercent?: number;
}

export interface WeatherForecast {
    points: readonly WeatherForecastPoint[];
}

export interface PvPredictionPoint {
    timestamp: number;
    expectedPowerW?: number;
    confidencePercent?: number;
}

export interface PvPrediction {
    points: readonly PvPredictionPoint[];
}

export interface PvLearningSample {
    timestamp: number;
    pvPowerW: number;
    temperatureC?: number;
    cloudCoverPercent?: number;
    precipitationProbabilityPercent?: number;
    solarRadiationWm2?: number;
    uvIndex?: number;
    hourOfDay: number;
    dayOfYear: number;
}

export interface PvPredictionModelInput {
    weatherForecast?: WeatherForecast;
    historicalSamples: readonly PvLearningSample[];
}

export interface PvPredictionModelResult {
    prediction: PvPrediction;
    modelName: string;
    explanation: readonly string[];
}

export interface ForecastProviderConfig {
    timestampStateId?: string;
    temperatureStateId?: string;
    cloudCoverStateId?: string;
    precipitationProbabilityStateId?: string;
}

export interface IForecastProvider {
    getForecast(config: ForecastProviderConfig): Promise<WeatherForecast>;
}
