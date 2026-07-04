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
    },
    info: {
        connection: "info.connection",
    },
    simulation: {
        ready: "simulation.ready",
    },
    optimizer: {
        recommendation: "optimizer.recommendation",
    },
} as const;

export type NumericStateId =
    | (typeof STATE_IDS.config)[keyof typeof STATE_IDS.config]
    | NumericLiveStateId
    | CostStateId
    | HealthStateId;
export type CostStateId = (typeof STATE_IDS.costs)[keyof typeof STATE_IDS.costs];
export type HealthStateId = (typeof STATE_IDS.health)[keyof typeof STATE_IDS.health];
export type BooleanStateId = typeof STATE_IDS.info.connection | typeof STATE_IDS.simulation.ready;
export type StringStateId = typeof STATE_IDS.optimizer.recommendation;

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
];
