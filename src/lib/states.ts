import type { NumericLiveStateId } from "./model";

export const STATE_IDS = {
    config: {
        workPriceCt: "config.currentTariff.workPriceCt",
        basePriceMonthlyEuro: "config.currentTariff.basePriceMonthlyEuro",
    },
    live: {
        gridImportPower: "live.grid.importPower",
        gridExportPower: "live.grid.exportPower",
        houseConsumptionPower: "live.house.consumptionPower",
        pvPower: "live.pv.power",
        batterySoc: "live.battery.soc",
        batteryPower: "live.battery.power",
    },
    costs: {
        todayCurrentTariffEuro: "costs.today.currentTariffEuro",
        monthCurrentTariffEuro: "costs.month.currentTariffEuro",
    },
    health: {
        configuredSources: "health.configuredSources",
        validSources: "health.validSources",
        missingSources: "health.missingSources",
        lastPollingTimestamp: "health.lastPollingTimestamp",
        lastPollingDurationMs: "health.lastPollingDurationMs",
        assetsCount: "health.assets.count",
        gridAssetsCount: "health.assets.grid.count",
        pvAssetsCount: "health.assets.pv.count",
        batteryAssetsCount: "health.assets.battery.count",
        consumerAssetsCount: "health.assets.consumer.count",
    },
    info: {
        connection: "info.connection",
    },
    simulation: {
        ready: "simulation.ready",
        publicationJson: "simulation.publication.json",
    },
    recommendation: {
        available: "recommendation.available",
        count: "recommendation.count",
        bestType: "recommendation.best.type",
        bestPriority: "recommendation.best.priority",
        bestReason: "recommendation.best.reason",
        bestValidFrom: "recommendation.best.validFrom",
        bestValidTo: "recommendation.best.validTo",
    },
    optimizer: {
        recommendation: "optimizer.recommendation",
    },
} as const;

export type NumericStateId =
    | (typeof STATE_IDS.config)[keyof typeof STATE_IDS.config]
    | NumericLiveStateId
    | CostStateId
    | HealthStateId
    | RecommendationNumericStateId;
export type CostStateId = (typeof STATE_IDS.costs)[keyof typeof STATE_IDS.costs];
export type HealthStateId = (typeof STATE_IDS.health)[keyof typeof STATE_IDS.health];
export type RecommendationNumericStateId =
    | typeof STATE_IDS.recommendation.count
    | typeof STATE_IDS.recommendation.bestValidFrom
    | typeof STATE_IDS.recommendation.bestValidTo;
export type BooleanStateId =
    | typeof STATE_IDS.info.connection
    | typeof STATE_IDS.simulation.ready
    | typeof STATE_IDS.recommendation.available;
export type StringStateId =
    | typeof STATE_IDS.optimizer.recommendation
    | typeof STATE_IDS.simulation.publicationJson
    | typeof STATE_IDS.recommendation.bestType
    | typeof STATE_IDS.recommendation.bestPriority
    | typeof STATE_IDS.recommendation.bestReason;

export interface NumericStateDefinition {
    id: NumericStateId;
    name: string;
    role: string;
    unit?: string;
    read?: boolean;
    write?: boolean;
}

export const numericStates: readonly NumericStateDefinition[] = [
    { id: STATE_IDS.config.workPriceCt, name: "Current fixed work price", role: "value.price", unit: "ct/kWh" },
    { id: STATE_IDS.config.basePriceMonthlyEuro, name: "Current fixed monthly base price", role: "value.price", unit: "EUR" },
    { id: STATE_IDS.live.gridImportPower, name: "Live grid import power", role: "value.power.consumption", unit: "W" },
    { id: STATE_IDS.live.gridExportPower, name: "Live grid export power", role: "value.power.feed", unit: "W" },
    { id: STATE_IDS.live.houseConsumptionPower, name: "Live house consumption power", role: "value.power.consumption", unit: "W" },
    { id: STATE_IDS.live.pvPower, name: "Live PV power", role: "value.power", unit: "W" },
    { id: STATE_IDS.live.batterySoc, name: "Live battery state of charge", role: "value.battery", unit: "%" },
    { id: STATE_IDS.live.batteryPower, name: "Live battery power", role: "value.power", unit: "W" },
    { id: STATE_IDS.costs.todayCurrentTariffEuro, name: "Current tariff costs today", role: "value.price", unit: "EUR" },
    { id: STATE_IDS.costs.monthCurrentTariffEuro, name: "Current tariff costs this month", role: "value.price", unit: "EUR" },
    { id: STATE_IDS.health.configuredSources, name: "Configured source count", role: "value" },
    { id: STATE_IDS.health.validSources, name: "Valid source count", role: "value" },
    { id: STATE_IDS.health.missingSources, name: "Missing source count", role: "value" },
    { id: STATE_IDS.health.lastPollingTimestamp, name: "Last polling timestamp", role: "value.time", unit: "ms" },
    { id: STATE_IDS.health.lastPollingDurationMs, name: "Last polling duration", role: "value.interval", unit: "ms" },
    { id: STATE_IDS.health.assetsCount, name: "Normalized energy asset count", role: "value" },
    { id: STATE_IDS.health.gridAssetsCount, name: "Normalized grid asset count", role: "value" },
    { id: STATE_IDS.health.pvAssetsCount, name: "Normalized PV asset count", role: "value" },
    { id: STATE_IDS.health.batteryAssetsCount, name: "Normalized battery asset count", role: "value" },
    { id: STATE_IDS.health.consumerAssetsCount, name: "Normalized consumer asset count", role: "value" },
    { id: STATE_IDS.recommendation.count, name: "Recommendation count", role: "value" },
    { id: STATE_IDS.recommendation.bestValidFrom, name: "Best recommendation valid from", role: "value.time", unit: "ms" },
    { id: STATE_IDS.recommendation.bestValidTo, name: "Best recommendation valid to", role: "value.time", unit: "ms" },
];
