export type DeviceCapabilityType =
    | "battery_charge_power"
    | "battery_discharge_power"
    | "switch_load"
    | "feed_in_limit"
    | "schedule_start"
    | "read_only";

export interface DeviceCapability {
    assetId: string;
    type: DeviceCapabilityType;
    minPowerW?: number;
    maxPowerW?: number;
    stepPowerW?: number;
    minDurationMinutes?: number;
    maxDurationMinutes?: number;
}
