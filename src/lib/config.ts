export interface EnergyOptimizerConfig {
    fixedWorkPriceCt?: number | string;
    fixedBasePriceMonthlyEuro?: number | string;
    sourceGridImportPower?: string;
    sourceGridExportPower?: string;
    sourceHouseConsumptionPower?: string;
    sourcePvPower?: string;
    sourceBatterySoc?: string;
    sourceBatteryPower?: string;
    pollingIntervalSeconds?: number | string;
}

export function toNumber(value: ioBroker.StateValue | number | string | undefined, fallback?: number): number | undefined {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    const numericValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

export function getPollingIntervalSeconds(config: EnergyOptimizerConfig): number {
    return Math.max(1, Math.round(toNumber(config.pollingIntervalSeconds, 60) ?? 60));
}
