import { AnalysisEngine } from "./AnalysisEngine";
import type { EnergyOptimizerConfig } from "./config";
import { ConfigurationNormalizer } from "./ConfigurationNormalizer";
import { EvaluationEngine } from "./EvaluationEngine";
import type { EnergyForecast } from "./forecast";
import type { IStateProvider } from "./model";
import type { OptimizationConstraint, OptimizationGoal, OptimizationGoalType } from "./optimization";
import { OptimizerInputFactory } from "./OptimizerInputFactory";
import { PredictionEngine } from "./PredictionEngine";
import { RecommendationEngine } from "./RecommendationEngine";
import type { SimulationRuntimeResult, SimulationWarning } from "./simulation";

const SIMULATION_INTERVAL_MINUTES = 15;
const MILLISECONDS_PER_MINUTE = 60_000;

interface SourceStatus {
    readonly id: string;
    readonly valid: boolean;
}

class SnapshotStateProvider implements IStateProvider {
    private readonly values = new Map<string, Promise<number | undefined>>();

    public constructor(private readonly source: IStateProvider) {}

    public readNumericState(sourceId: string | undefined): Promise<number | undefined> {
        if (!sourceId) return Promise.resolve(undefined);
        let value = this.values.get(sourceId);
        if (!value) {
            value = this.source.readNumericState(sourceId);
            this.values.set(sourceId, value);
        }
        return value;
    }
}

export class SimulationRuntime {
    private readonly configurationNormalizer = new ConfigurationNormalizer();
    private readonly analysisEngine = new AnalysisEngine();
    private readonly predictionEngine = new PredictionEngine({
        resolutionMinutes: SIMULATION_INTERVAL_MINUTES,
        horizonMinutes: SIMULATION_INTERVAL_MINUTES,
    });
    private readonly evaluationEngine = new EvaluationEngine();
    private readonly recommendationEngine = new RecommendationEngine();

    public constructor(
        private readonly stateProvider: IStateProvider,
        private readonly clock: () => number = Date.now,
    ) {}

    public async simulate(config: EnergyOptimizerConfig): Promise<SimulationRuntimeResult> {
        const generatedAt = this.clock();
        const snapshotProvider = new SnapshotStateProvider(this.stateProvider);
        const optimizerInputFactory = new OptimizerInputFactory(snapshotProvider, this.configurationNormalizer);
        const input = await optimizerInputFactory.create(config);
        const analysis = { ...this.analysisEngine.analyze(input.system), timestamp: generatedAt };
        const prediction = this.predictionEngine.predict(
            analysis,
            this.createCurrentStateForecast(generatedAt, analysis.totalPvProductionW, analysis.totalConsumptionW),
        );
        const situations = this.evaluationEngine.evaluate(analysis, prediction);
        const sourceStatus = await this.sourceStatus(config, snapshotProvider);
        const missingSourceIds = sourceStatus.filter(source => !source.valid).map(source => source.id);
        const recommendations =
            missingSourceIds.length === 0
                ? this.recommendationEngine.recommend(
                      situations,
                      this.createGoals(input.goals),
                      this.createConstraints(input.goals.emergencyReservePercent),
                  )
                : [];
        const warnings: SimulationWarning[] = missingSourceIds.length
            ? [
                  {
                      code: "incomplete_source_data",
                      message: "One or more configured source states have no valid numeric value.",
                      missingSourceIds,
                  },
              ]
            : [];

        return {
            generatedAt,
            configuredSourcesCount: sourceStatus.length,
            validSourcesCount: sourceStatus.length - missingSourceIds.length,
            missingSourcesCount: missingSourceIds.length,
            analysis,
            prediction,
            situations,
            recommendations,
            warnings,
        };
    }

    private createCurrentStateForecast(
        generatedAt: number,
        pvPowerW: number,
        consumptionPowerW: number,
    ): EnergyForecast {
        return {
            generatedAt,
            validFrom: generatedAt,
            validTo: generatedAt + SIMULATION_INTERVAL_MINUTES * MILLISECONDS_PER_MINUTE,
            pvPower: [{ timestamp: generatedAt, powerW: pvPowerW }],
            consumptionPower: [{ timestamp: generatedAt, powerW: consumptionPowerW }],
            gridPrice: [],
            weather: [],
        };
    }

    private createGoals(goals: {
        readonly maximizeSelfConsumption: boolean;
        readonly minimizeGridCosts: boolean;
        readonly preserveBatteryForEvening: boolean;
        readonly minimizeBatteryCycles: boolean;
        readonly gridOptimization: { readonly mode: string };
    }): readonly OptimizationGoal[] {
        const priorities = new Map<OptimizationGoalType, number>();
        const add = (type: OptimizationGoalType, priority: number): void => {
            priorities.set(type, Math.max(priority, priorities.get(type) ?? 0));
        };

        if (goals.maximizeSelfConsumption) add("maximize_self_consumption", 80);
        if (goals.minimizeGridCosts) {
            add("minimize_cost", 70);
            add("minimize_grid_import", 70);
        }
        if (goals.preserveBatteryForEvening) add("protect_battery", 80);
        if (goals.minimizeBatteryCycles) add("protect_battery", 70);
        if (goals.gridOptimization.mode === "zeroExport") add("avoid_feed_in", 90);

        return [...priorities.entries()].map(([type, priority]) => ({ type, priority, enabled: true }));
    }

    private createConstraints(emergencyReservePercent: number): readonly OptimizationConstraint[] {
        return Number.isFinite(emergencyReservePercent)
            ? [
                  {
                      type: "state_of_charge_limit",
                      enabled: true,
                      minStateOfChargePercent: emergencyReservePercent,
                      reason: "Configured emergency battery reserve.",
                  },
              ]
            : [];
    }

    private async sourceStatus(
        config: EnergyOptimizerConfig,
        stateProvider: IStateProvider,
    ): Promise<readonly SourceStatus[]> {
        const sourceIds: string[] = [];
        const add = (id: string | undefined): void => {
            const normalizedId = id?.trim();
            if (normalizedId) sourceIds.push(normalizedId);
        };

        add(config.sourceGridImportPower);
        add(config.sourceGridExportPower);
        add(config.sourceHouseConsumptionPower);
        add(config.sourcePvPower);
        add(config.sourceBatterySoc);
        add(config.sourceBatteryPower);

        const normalizedAssets = this.configurationNormalizer.normalize(config);
        for (const assetConfig of normalizedAssets) {
            add(assetConfig.powerStateId);
            add(assetConfig.socStateId);
        }

        const uniqueIds = [...new Set(sourceIds)];
        const values = await Promise.all(uniqueIds.map(id => stateProvider.readNumericState(id)));
        return uniqueIds.map((id, index) => ({
            id,
            valid: values[index] !== undefined && Number.isFinite(values[index]),
        }));
    }
}
