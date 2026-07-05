import type { PredictionHorizon } from "../prediction";

export type ExecutionActionType =
    | "charge_storage"
    | "discharge_storage"
    | "switch_consumer_on"
    | "switch_consumer_off"
    | "limit_feed_in"
    | "schedule_consumer";

export interface ExecutionAction {
    readonly type: ExecutionActionType;
    readonly targetAssetId: string;
    readonly horizon?: Readonly<PredictionHorizon>;
    readonly powerW?: number;
    readonly energyWh?: number;
    readonly durationMinutes?: number;
    readonly reason?: string;
}
