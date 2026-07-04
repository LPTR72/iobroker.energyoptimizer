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
    productionPowerW?: number;
}

export interface BatteryState {
    socPercent?: number;
    powerW?: number;
    capacityWh?: number;
}

export interface HouseState {
    consumptionPowerW?: number;
}

export interface EnergySystemState {
    grid: GridState;
    pv: PvState;
    battery: BatteryState;
    house: HouseState;
}

export interface OptimizationGoals {
    maximizeSelfConsumption: boolean;
    minimizeGridCosts: boolean;
    preserveBatteryForEvening: boolean;
    emergencyReservePercent: number;
    minimizeBatteryCycles: boolean;
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

export interface ForecastProviderConfig {
    timestampStateId?: string;
    temperatureStateId?: string;
    cloudCoverStateId?: string;
    precipitationProbabilityStateId?: string;
}

export interface IForecastProvider {
    getForecast(config: ForecastProviderConfig): Promise<WeatherForecast>;
}
