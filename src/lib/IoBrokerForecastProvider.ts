import {
    ForecastProviderConfig,
    IForecastProvider,
    IStateProvider,
    WeatherForecast,
    WeatherForecastPoint,
} from "./model";

export class IoBrokerForecastProvider implements IForecastProvider {
    public constructor(private readonly stateProvider: IStateProvider) {}

    public async getForecast(config: ForecastProviderConfig): Promise<WeatherForecast> {
        const [timestamp, temperatureC, cloudCoverPercent, precipitationProbabilityPercent] = await Promise.all([
            this.stateProvider.readNumericState(config.timestampStateId),
            this.stateProvider.readNumericState(config.temperatureStateId),
            this.stateProvider.readNumericState(config.cloudCoverStateId),
            this.stateProvider.readNumericState(config.precipitationProbabilityStateId),
        ]);

        if (timestamp === undefined) {
            return { points: [] };
        }

        const point: WeatherForecastPoint = {
            timestamp,
            temperatureC,
            cloudCoverPercent,
            precipitationProbabilityPercent,
        };

        return { points: [point] };
    }
}
