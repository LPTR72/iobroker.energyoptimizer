# ioBroker.energyoptimizer

`ioBroker.energyoptimizer` is a generic ioBroker adapter for collecting existing energy data points, mirroring live values and calculating costs with a fixed electricity tariff.

The adapter does not call external APIs and does not actively control any device. It only reads configured source states, mirrors values and calculates simple running cost totals.

## Features

- Creates the required adapter states on startup
- Reads configured source states every `pollingIntervalSeconds`
- Mirrors live energy values into `live.*`
- Calculates grid import energy per interval
- Adds fixed-tariff costs to daily and monthly counters
- Handles missing, empty or non-numeric source states without crashing

## Created States

- `info.connection`
- `config.currentTariff.workPriceCt`
- `config.currentTariff.basePriceMonthlyEuro`
- `live.grid.importPower`
- `live.grid.exportPower`
- `live.house.consumptionPower`
- `live.pv.power`
- `live.battery.soc`
- `live.battery.power`
- `costs.today.currentTariffEuro`
- `costs.month.currentTariffEuro`
- `simulation.ready`
- `optimizer.recommendation`

## Native Configuration

- `fixedWorkPriceCt`
- `fixedBasePriceMonthlyEuro`
- `sourceGridImportPower`
- `sourceGridExportPower`
- `sourceHouseConsumptionPower`
- `sourcePvPower`
- `sourceBatterySoc`
- `sourceBatteryPower`
- `pollingIntervalSeconds` with default `60`

## Cost Calculation

For every polling interval:

```text
kWh = importPowerW / 1000 * pollingIntervalSeconds / 3600
cost = kWh * fixedWorkPriceCt / 100
```

The calculated cost is added to:

- `costs.today.currentTariffEuro`
- `costs.month.currentTariffEuro`

## Roadmap

- Daily and monthly counter reset logic
- Optional base-price allocation
- Variable tariff support
- Battery and tariff simulation
- PV surplus and grid import optimization recommendations
- Historical data aggregation
- Adapter test suite and CI workflow

## Development

```bash
npm install
npm run build
```

## License

MIT
