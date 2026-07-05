import { EnergyOptimizerConfig, toNumber } from "./config";
import { NumericLiveStateId } from "./model";
import type { RecommendationProjection } from "./RecommendationProjection";
import type { SimulationPublicationSnapshot } from "./SimulationPublication";
import { BooleanStateId, CostStateId, STATE_IDS, StringStateId, numericStates } from "./states";

const INITIAL_SIMULATION_PUBLICATION_JSON = JSON.stringify({
    status: "awaiting_first_simulation",
    warnings: [],
    recommendations: [],
});

export interface HealthStatus {
    configuredSources: number;
    validSources: number;
    missingSources: number;
    lastPollingTimestamp: number;
    lastPollingDurationMs: number;
    assetsCount: number;
    gridAssetsCount: number;
    pvAssetsCount: number;
    batteryAssetsCount: number;
    consumerAssetsCount: number;
}

export class StateManager {
    public constructor(private readonly adapter: ioBroker.Adapter) {}

    public async createStates(): Promise<void> {
        for (const state of numericStates) {
            await this.adapter.setObjectNotExistsAsync(state.id, {
                type: "state",
                common: {
                    name: state.name,
                    type: "number",
                    role: state.role,
                    read: state.read ?? true,
                    write: state.write ?? false,
                    unit: state.unit,
                    def: 0,
                },
                native: {},
            });
        }

        await this.createBooleanState(STATE_IDS.info.connection, "Adapter connection state", "indicator.connected", false);
        await this.createBooleanState(STATE_IDS.simulation.ready, "Simulation data readiness", "indicator", false);
        await this.createBooleanState(STATE_IDS.recommendation.available, "Recommendation available", "indicator", false);
        await this.createStringState(
            STATE_IDS.simulation.publicationJson,
            "Simulation publication snapshot",
            "json",
            INITIAL_SIMULATION_PUBLICATION_JSON,
        );
        await this.createStringState(STATE_IDS.optimizer.recommendation, "Optimizer recommendation", "text", "");
        await this.createStringState(STATE_IDS.recommendation.bestType, "Best recommendation type", "text", "");
        await this.createStringState(STATE_IDS.recommendation.bestPriority, "Best recommendation priority", "text", "");
        await this.createStringState(STATE_IDS.recommendation.bestReason, "Best recommendation reason", "text", "");
    }

    public async initializeRuntimeStates(config: EnergyOptimizerConfig): Promise<void> {
        const workPriceCt = toNumber(config.fixedWorkPriceCt, 0) ?? 0;
        const basePriceMonthlyEuro = toNumber(config.fixedBasePriceMonthlyEuro, 0) ?? 0;

        await this.adapter.setStateAsync(STATE_IDS.info.connection, true, true);
        await this.adapter.setStateAsync(STATE_IDS.simulation.ready, false, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.available, false, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.count, 0, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestType, "", true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestPriority, "", true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestReason, "", true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestValidFrom, 0, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestValidTo, 0, true);
        await this.adapter.setStateAsync(
            STATE_IDS.simulation.publicationJson,
            INITIAL_SIMULATION_PUBLICATION_JSON,
            true,
        );
        await this.adapter.setStateAsync(STATE_IDS.optimizer.recommendation, "collecting data", true);
        await this.adapter.setStateAsync(STATE_IDS.config.workPriceCt, workPriceCt, true);
        await this.adapter.setStateAsync(STATE_IDS.config.basePriceMonthlyEuro, basePriceMonthlyEuro, true);
    }

    public async writeMirroredLiveValue(stateId: NumericLiveStateId, value: number): Promise<void> {
        await this.adapter.setStateAsync(stateId, value, true);
    }

    public async writeSimulationPublication(
        snapshot: SimulationPublicationSnapshot,
        recommendation: RecommendationProjection,
    ): Promise<void> {
        await this.adapter.setStateAsync(STATE_IDS.simulation.publicationJson, snapshot.json, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.count, recommendation.count, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestType, recommendation.bestType, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestPriority, recommendation.bestPriority, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestReason, recommendation.bestReason, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestValidFrom, recommendation.bestValidFrom, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestValidTo, recommendation.bestValidTo, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.available, recommendation.available, true);
        await this.adapter.setStateAsync(STATE_IDS.simulation.ready, snapshot.ready, true);
    }

    public async markSimulationUnavailable(): Promise<void> {
        await this.adapter.setStateAsync(STATE_IDS.recommendation.count, 0, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestType, "", true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestPriority, "", true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestReason, "", true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestValidFrom, 0, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.bestValidTo, 0, true);
        await this.adapter.setStateAsync(STATE_IDS.recommendation.available, false, true);
        await this.adapter.setStateAsync(STATE_IDS.simulation.ready, false, true);
    }

    public async writeHealthStatus(status: HealthStatus): Promise<void> {
        await this.adapter.setStateAsync(STATE_IDS.health.configuredSources, status.configuredSources, true);
        await this.adapter.setStateAsync(STATE_IDS.health.validSources, status.validSources, true);
        await this.adapter.setStateAsync(STATE_IDS.health.missingSources, status.missingSources, true);
        await this.adapter.setStateAsync(STATE_IDS.health.lastPollingTimestamp, status.lastPollingTimestamp, true);
        await this.adapter.setStateAsync(STATE_IDS.health.lastPollingDurationMs, status.lastPollingDurationMs, true);
        await this.adapter.setStateAsync(STATE_IDS.health.assetsCount, status.assetsCount, true);
        await this.adapter.setStateAsync(STATE_IDS.health.gridAssetsCount, status.gridAssetsCount, true);
        await this.adapter.setStateAsync(STATE_IDS.health.pvAssetsCount, status.pvAssetsCount, true);
        await this.adapter.setStateAsync(STATE_IDS.health.batteryAssetsCount, status.batteryAssetsCount, true);
        await this.adapter.setStateAsync(STATE_IDS.health.consumerAssetsCount, status.consumerAssetsCount, true);
    }

    public async addCost(valueToAdd: number): Promise<void> {
        await this.addToState(STATE_IDS.costs.todayCurrentTariffEuro, valueToAdd);
        await this.addToState(STATE_IDS.costs.monthCurrentTariffEuro, valueToAdd);
    }

    private async addToState(stateId: CostStateId, valueToAdd: number): Promise<void> {
        if (!Number.isFinite(valueToAdd) || valueToAdd <= 0) {
            return;
        }

        const currentState = await this.adapter.getStateAsync(stateId);
        const currentValue = toNumber(currentState?.val, 0) ?? 0;
        await this.adapter.setStateAsync(stateId, Number((currentValue + valueToAdd).toFixed(6)), true);
    }

    private async createBooleanState(id: BooleanStateId, name: string, role: string, def: boolean): Promise<void> {
        await this.adapter.setObjectNotExistsAsync(id, {
            type: "state",
            common: { name, type: "boolean", role, read: true, write: false, def },
            native: {},
        });
    }

    private async createStringState(id: StringStateId, name: string, role: string, def: string): Promise<void> {
        await this.adapter.setObjectNotExistsAsync(id, {
            type: "state",
            common: { name, type: "string", role, read: true, write: false, def },
            native: {},
        });
    }
}
