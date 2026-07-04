import { EnergyAnalysis } from "./analysis";
import { EnergyForecast, PowerForecastPoint } from "./forecast";
import {
    BatteryPrediction,
    EnergyPrediction,
    PowerPrediction,
    PredictionHorizon,
    PredictionWarning,
    PricePrediction,
} from "./prediction";
import { TimeSeriesMerger } from "./TimeSeriesMerger";

export class PredictionEngine {
    private readonly timeSeriesMerger = new TimeSeriesMerger();

    public predict(analysis: EnergyAnalysis, forecast: EnergyForecast): EnergyPrediction {
        const warnings: PredictionWarning[] = [];
        const pvPower = forecast.pvPower ?? [];
        const consumptionPower = forecast.consumptionPower ?? [];
        const timestamps = this.timeSeriesMerger.mergeTimestamps(pvPower, consumptionPower);
        const intervals = this.timeSeriesMerger.createIntervals(timestamps, forecast.validTo);
        const overallHorizon = { from: forecast.validFrom, to: forecast.validTo };

        let power: PowerPrediction[];
        if (timestamps.length === 0) {
            this.addWarning(warnings, "missing_forecast_data", "No PV or consumption forecast data is available.");
            power = [
                this.createPowerPrediction(
                    overallHorizon,
                    this.toNonNegativeNumber(analysis.totalPvProductionW),
                    this.toNonNegativeNumber(analysis.totalConsumptionW),
                ),
            ];
        } else {
            const pvByTimestamp = this.toPowerMap(pvPower);
            const consumptionByTimestamp = this.toPowerMap(consumptionPower);
            power = timestamps.map((timestamp, index) => {
                const pvValue = pvByTimestamp.get(timestamp);
                const consumptionValue = consumptionByTimestamp.get(timestamp);

                if (pvValue === undefined) {
                    this.addWarning(warnings, "missing_pv_forecast", "PV forecast data is incomplete.");
                }
                if (consumptionValue === undefined) {
                    this.addWarning(warnings, "missing_consumption_forecast", "Consumption forecast data is incomplete.");
                }

                return this.createPowerPrediction(
                    intervals[index],
                    pvValue ?? this.toNonNegativeNumber(analysis.totalPvProductionW),
                    consumptionValue ?? this.toNonNegativeNumber(analysis.totalConsumptionW),
                );
            });
        }

        const gridPrice = forecast.gridPrice ?? [];
        const priceIntervals = this.timeSeriesMerger.createIntervals(
            gridPrice.map(point => point.timestamp),
            forecast.validTo,
        );
        const prices: PricePrediction[] = gridPrice.map((point, index) => ({
            horizon: priceIntervals[index],
            expectedGridPriceCtPerKWh: Number.isFinite(point.priceCtPerKWh) ? point.priceCtPerKWh : undefined,
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
