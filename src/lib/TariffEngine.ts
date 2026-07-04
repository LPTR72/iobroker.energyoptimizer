export class TariffEngine {
    public static calculateIntervalKwh(importPowerW: number, pollingIntervalSeconds: number): number {
        const safeImportPowerW = Math.max(importPowerW, 0);
        return (safeImportPowerW / 1000) * (pollingIntervalSeconds / 3600);
    }

    public static calculateIntervalCostEuro(intervalKwh: number, workPriceCt: number): number {
        return intervalKwh * (workPriceCt / 100);
    }
}
