import type { EnergyAnalysis } from "./analysis";
import type { EvaluationOptions } from "./evaluation";
import type { EnergySituation, EnergySituationSeverity, EnergySituationType } from "./optimization";
import type { EnergyPrediction, PredictionHorizon } from "./prediction";

export const DEFAULT_EVALUATION_OPTIONS: Readonly<EvaluationOptions> = {
    minimumRelevantPowerW: 20,
    lowBatterySocPercent: 20,
    highBatterySocPercent: 80,
    fullBatterySocPercent: 95,
    // Placeholder/demo values only. Real tariff thresholds are deployment- and time-specific.
    cheapPriceCtPerKWh: 20,
    highPriceCtPerKWh: 40,
};

export class EvaluationEngine {
    private readonly options: Readonly<EvaluationOptions>;

    public constructor(options: EvaluationOptions = DEFAULT_EVALUATION_OPTIONS) {
        this.validateOptions(options);
        this.options = { ...options };
    }

    public evaluate(analysis: EnergyAnalysis, prediction: EnergyPrediction): readonly EnergySituation[] {
        const situations: EnergySituation[] = [];
        const currentHorizon = { from: analysis.timestamp, to: analysis.timestamp };

        if (analysis.surplusW >= this.options.minimumRelevantPowerW) {
            situations.push(this.situation("pv_surplus", "info", currentHorizon, "PV production exceeds consumption."));
        }
        if (analysis.gridImportW >= this.options.minimumRelevantPowerW) {
            situations.push(this.situation("grid_import", "info", currentHorizon, "The system is importing energy from the grid."));
        }
        if (analysis.gridExportW >= this.options.minimumRelevantPowerW) {
            situations.push(this.situation("grid_export", "info", currentHorizon, "The system is exporting energy to the grid."));
        }

        const batteryAssetIds = analysis.assetHealth
            .filter(asset => asset.type === "battery" && asset.available)
            .map(asset => asset.id);
        if (batteryAssetIds.length > 0) {
            this.addBatterySituation(
                situations,
                analysis.batterySocPercentAverage,
                currentHorizon,
                batteryAssetIds,
                false,
            );
        }

        for (const power of prediction.power) {
            if (power.expectedSurplusW >= this.options.minimumRelevantPowerW) {
                situations.push(
                    this.situation("pv_surplus", "info", power.horizon, "A PV surplus is predicted."),
                );
            }
        }

        if (batteryAssetIds.length > 0) {
            for (const battery of prediction.battery) {
                this.addBatterySituation(
                    situations,
                    battery.expectedSocPercent,
                    battery.horizon,
                    batteryAssetIds,
                    true,
                );
            }
        }

        for (const price of prediction.prices) {
            const value = price.expectedGridPriceCtPerKWh;
            if (value === undefined || !Number.isFinite(value)) {
                continue;
            }
            if (value <= this.options.cheapPriceCtPerKWh) {
                situations.push(this.situation("cheap_price_period", "info", price.horizon, "A cheap price period is predicted."));
            } else if (value >= this.options.highPriceCtPerKWh) {
                situations.push(this.situation("high_price_period", "warning", price.horizon, "A high price period is predicted."));
            }
        }

        if (prediction.warnings.length > 0) {
            situations.push(
                this.situation(
                    "forecast_uncertain",
                    "warning",
                    prediction.horizon,
                    "The prediction contains data-quality warnings.",
                ),
            );
        }

        return situations;
    }

    private addBatterySituation(
        situations: EnergySituation[],
        stateOfChargePercent: number | undefined,
        horizon: Readonly<PredictionHorizon>,
        relatedAssetIds: readonly string[],
        predicted: boolean,
    ): void {
        if (stateOfChargePercent === undefined || !Number.isFinite(stateOfChargePercent)) {
            return;
        }

        if (stateOfChargePercent <= this.options.lowBatterySocPercent) {
            situations.push({
                ...this.situation(
                    "battery_low",
                    "warning",
                    horizon,
                    predicted ? "A low battery state of charge is predicted." : "The battery state of charge is low.",
                ),
                relatedAssetIds,
            });
        } else if (predicted && stateOfChargePercent >= this.options.fullBatterySocPercent) {
            situations.push({
                ...this.situation("battery_full_soon", "info", horizon, "The battery is predicted to be nearly full."),
                relatedAssetIds,
            });
        } else if (stateOfChargePercent >= this.options.highBatterySocPercent) {
            situations.push({
                ...this.situation(
                    "battery_high",
                    "info",
                    horizon,
                    predicted ? "A high battery state of charge is predicted." : "The battery state of charge is high.",
                ),
                relatedAssetIds,
            });
        }
    }

    private situation(
        type: EnergySituationType,
        severity: EnergySituationSeverity,
        horizon: Readonly<PredictionHorizon>,
        message: string,
    ): EnergySituation {
        return { type, severity, horizon, message };
    }

    private validateOptions(options: EvaluationOptions): void {
        const values = Object.values(options);
        if (!values.every(value => Number.isFinite(value))) {
            throw new RangeError("Evaluation options must contain finite numbers.");
        }
        if (options.minimumRelevantPowerW < 0) {
            throw new RangeError("minimumRelevantPowerW must not be negative.");
        }
        if (
            options.lowBatterySocPercent < 0 ||
            options.lowBatterySocPercent > options.highBatterySocPercent ||
            options.highBatterySocPercent > options.fullBatterySocPercent ||
            options.fullBatterySocPercent > 100
        ) {
            throw new RangeError("Battery thresholds must be ordered between 0 and 100 percent.");
        }
        if (options.cheapPriceCtPerKWh > options.highPriceCtPerKWh) {
            throw new RangeError("cheapPriceCtPerKWh must not exceed highPriceCtPerKWh.");
        }
    }
}
