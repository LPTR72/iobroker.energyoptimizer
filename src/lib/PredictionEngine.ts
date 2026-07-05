import { EnergyAnalysis } from "./analysis";
import { EnergyForecast, PowerForecastPoint } from "./forecast";
import {
    BatteryPrediction,
    EnergyPrediction,
    PowerPrediction,
    PredictionHorizon,
    PredictionOptions,
    PredictionWarning,
    PricePrediction,
} from "./prediction";

const MILLISECONDS_PER_MINUTE = 60_000;

export const DEFAULT_PREDICTION_OPTIONS: Readonly<PredictionOptions> = {
    resolutionMinutes: 15,
    horizonMinutes: 24 * 60,
};

export class PredictionEngine {
    private readonly options: Readonly<PredictionOptions>;

    public constructor(options: PredictionOptions = DEFAULT_PREDICTION_OPTIONS) {
        this.validateOptions(options);
        this.options = { ...options };
    }

    public predict(analysis: EnergyAnalysis, forecast: EnergyForecast): EnergyPrediction {
        const warnings: PredictionWarning[] = [];
        const pvPower = forecast.pvPower ?? [];
        const consumptionPower = forecast.consumptionPower ?? [];
        const overallHorizon = this.createOverallHorizon(forecast.validFrom);
        const intervals = this.createIntervals(overallHorizon);
        const pvByTimestamp = this.toPowerMap(pvPower);
        const consumptionByTimestamp = this.toPowerMap(consumptionPower);
        const hasPowerForecast = pvPower.length > 0 || consumptionPower.length > 0;

        if (pvPower.length === 0 && consumptionPower.length === 0) {
            this.addWarning(warnings, "missing_forecast_data", "No PV or consumption forecast data is available.");
        }

        const power = intervals.map(interval => {
            const pvValue = pvByTimestamp.get(interval.from);
            const consumptionValue = consumptionByTimestamp.get(interval.from);

            if (hasPowerForecast && pvValue === undefined) {
                this.addWarning(warnings, "missing_pv_forecast", "PV forecast data is incomplete.");
            }
            if (hasPowerForecast && consumptionValue === undefined) {
                this.addWarning(warnings, "missing_consumption_forecast", "Consumption forecast data is incomplete.");
            }

            return this.createPowerPrediction(
                interval,
                pvValue ?? this.toNonNegativeNumber(analysis.totalPvProductionW),
                consumptionValue ?? this.toNonNegativeNumber(analysis.totalConsumptionW),
            );
        });

        const gridPrice = forecast.gridPrice ?? [];
        const resolutionMs = this.options.resolutionMinutes * MILLISECONDS_PER_MINUTE;
        const prices: PricePrediction[] = gridPrice
            .filter(
                point =>
                    Number.isFinite(point.timestamp) &&
                    point.timestamp >= overallHorizon.from &&
                    point.timestamp < overallHorizon.to,
            )
            .map(point => ({
                horizon: {
                    from: point.timestamp,
                    to: Math.min(point.timestamp + resolutionMs, overallHorizon.to),
                },
                expectedGridPriceCtPerKWh: Number.isFinite(point.priceCtPerKWh)
                    ? point.priceCtPerKWh
                    : undefined,
            }));
        const expectedSocPercent = Number.isFinite(analysis.batterySocPercentAverage)
            ? analysis.batterySocPercentAverage
            : undefined;
        const battery: BatteryPrediction[] = power.map(prediction => ({
            horizon: prediction.horizon,
            expectedSocPercent,
        }));

        return {
            generatedAt: forecast.generatedAt,
            horizon: overallHorizon,
            power,
            prices,
            battery,
            warnings,
        };
    }

    private createOverallHorizon(from: number): PredictionHorizon {
        return {
            from,
            to: from + this.options.horizonMinutes * MILLISECONDS_PER_MINUTE,
        };
    }

    private createIntervals(horizon: PredictionHorizon): PredictionHorizon[] {
        const resolutionMs = this.options.resolutionMinutes * MILLISECONDS_PER_MINUTE;
        const intervals: PredictionHorizon[] = [];

        for (let from = horizon.from; from < horizon.to; from += resolutionMs) {
            intervals.push({ from, to: Math.min(from + resolutionMs, horizon.to) });
        }

        return intervals;
    }

    private validateOptions(options: PredictionOptions): void {
        if (!Number.isFinite(options.resolutionMinutes) || options.resolutionMinutes <= 0) {
            throw new RangeError("resolutionMinutes must be greater than zero.");
        }
        if (!Number.isFinite(options.horizonMinutes) || options.horizonMinutes <= 0) {
            throw new RangeError("horizonMinutes must be greater than zero.");
        }
        if (options.horizonMinutes < options.resolutionMinutes) {
            throw new RangeError("horizonMinutes must be at least resolutionMinutes.");
        }
    }

    private toPowerMap(points: readonly PowerForecastPoint[]): Map<number, number> {
        return new Map(
            points
                .filter(point => Number.isFinite(point.timestamp))
                .map(point => [point.timestamp, this.toNonNegativeNumber(point.powerW)]),
        );
    }

    private createPowerPrediction(
        horizon: PredictionHorizon,
        expectedPvPowerW: number,
        expectedConsumptionPowerW: number,
    ): PowerPrediction {
        return {
            horizon,
            expectedPvPowerW,
            expectedConsumptionPowerW,
            expectedSurplusW: Math.max(0, expectedPvPowerW - expectedConsumptionPowerW),
            expectedDeficitW: Math.max(0, expectedConsumptionPowerW - expectedPvPowerW),
        };
    }

    private addWarning(warnings: PredictionWarning[], code: string, message: string): void {
        if (!warnings.some(warning => warning.code === code)) {
            warnings.push({ code, message });
        }
    }

    private toNonNegativeNumber(value: number): number {
        return Number.isFinite(value) ? Math.max(0, value) : 0;
    }
}
