export type ForecastProviderType =
    | "static"
    | "history"
    | "forecastSolar"
    | "tibber"
    | "weather"
    | "manual";

export interface ForecastPoint {
    timestamp: number;
}

export interface PowerForecastPoint extends ForecastPoint {
    powerW: number;
}

export interface PriceForecastPoint extends ForecastPoint {
    priceCtPerKWh: number;
}

export interface WeatherForecastPoint extends ForecastPoint {
    temperatureC?: number;
    cloudCoverPercent?: number;
    globalRadiationWm2?: number;
}

export interface EnergyForecast {
    generatedAt: number;
    validFrom: number;
    validTo: number;
    pvPower: readonly PowerForecastPoint[];
    consumptionPower: readonly PowerForecastPoint[];
    gridPrice: readonly PriceForecastPoint[];
    weather: readonly WeatherForecastPoint[];
}

export interface ForecastProviderResult {
    providerType: ForecastProviderType;
    generatedAt: number;
    forecast: EnergyForecast;
    warnings: readonly string[];
}

export interface ForecastProvider {
    readonly providerType: ForecastProviderType;
    getForecast(): Promise<ForecastProviderResult>;
}
