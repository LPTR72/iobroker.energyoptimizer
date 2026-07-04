import type { STATE_IDS } from "./states";

export interface LiveEnergyData {
    gridImportPowerW?: number;
    gridExportPowerW?: number;
    houseConsumptionPowerW?: number;
    pvPowerW?: number;
    batterySoc?: number;
    batteryPowerW?: number;
}

export interface TariffConfig {
    workPriceCt: number;
    basePriceMonthlyEuro: number;
}

export interface OptimizerResult {
    recommendation: string;
}

export type NumericLiveStateId = (typeof STATE_IDS.live)[keyof typeof STATE_IDS.live];

export interface IStateProvider {
    readNumericState(sourceId: string | undefined): Promise<number | undefined>;
}
