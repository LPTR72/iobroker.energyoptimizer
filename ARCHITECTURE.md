# ARCHITECTURE.md

# ioBroker Energy Optimizer

> Living architecture document for the `iobroker.energyoptimizer`
> project.

------------------------------------------------------------------------

# Vision

The long-term goal is to build a **manufacturer-independent Home Energy
Management System (HEMS)** for ioBroker.

The adapter is **not** intended to become an EcoFlow adapter. EcoFlow is
one possible integration among many.

Supported now or planned:

-   Grid
-   Multiple PV systems
-   Multiple battery systems
-   House consumption
-   EV chargers
-   Heat pumps
-   Boilers
-   Generators
-   Dynamic electricity tariffs
-   Weather providers
-   Forecast providers
-   Flexible loads

The complete optimization engine should operate on **generic energy
assets**.

------------------------------------------------------------------------

# High-Level Architecture

``` text
                 ioBroker
                     │
                     ▼
          IoBrokerStateProvider
                     │
                     ▼
       ConfigurationNormalizer
                     │
                     ▼
          EnergySystemFactory
                     │
                     ▼
            EnergySystemState
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 Prediction     Analysis      Evaluation
      └──────────────┼──────────────┘
                     ▼
          RecommendationEngine
                     ▼
              OptimizerEngine
```

## Design Rules

-   ioBroker is only a data source.
-   Business logic should be independent of ioBroker.
-   Prefer dependency injection and small components.
-   Every architectural change should preserve backward compatibility
    whenever practical.

------------------------------------------------------------------------

# Domain Model

## EnergySystemState

Compatibility views:

-   grid
-   pv
-   battery
-   house

Future-first model:

-   assets\[\]
-   pvSystems\[\]
-   batteries\[\]

## EnergyAsset

Typical fields:

-   id
-   type
-   name
-   manufacturer
-   model
-   currentPowerW
-   socPercent
-   capacityWh
-   capabilities

Supported asset types:

-   grid
-   pv
-   battery
-   consumer
-   evCharger
-   heatPump
-   boiler
-   generator
-   unknown

------------------------------------------------------------------------

# Core Components

## StateManager

Responsible for:

-   creating adapter states
-   writing live values
-   writing costs
-   writing health information

## TariffEngine

Responsible for:

-   energy calculations
-   tariff calculations
-   future dynamic tariffs

## ConfigurationNormalizer

Single entry point for configuration.

Responsibilities:

-   normalize legacy configuration
-   normalize asset configuration
-   provide one internal configuration model

## EnergySystemFactory

Builds the internal EnergySystemState from normalized assets.

## PredictionEngine

Future production, consumption and tariff forecasts.

## AnalysisEngine

Analyses the energy system.

## EvaluationEngine

Evaluates optimization strategies.

## RecommendationEngine

Creates recommendations.

## OptimizerEngine

Executes optimization strategies.

------------------------------------------------------------------------

# Admin Configuration

Current sections:

-   Tariff
-   Grid
-   House
-   Photovoltaics
-   Battery
-   Energy Assets
-   Runtime

Current migration strategy:

Legacy configuration remains supported.

New functionality should be implemented using **Energy Assets**.

ConfigurationNormalizer bridges both worlds.

------------------------------------------------------------------------

# Development Workflow

``` text
ChatGPT
      │
Architecture discussion
      │
Generate Codex prompt
      │
Codex implementation
      │
Review
      │
Commit
      │
Push
      │
Deploy to ioBroker
      │
Verify
      │
Repeat
```

## Review Checklist

Always review:

``` bash
git diff --stat
git diff -- <file>
git status
```

Only then:

``` bash
git add ...
git commit -m "..."
git push
```

------------------------------------------------------------------------

# Deployment Workflow

Development server:

``` bash
cd /tmp/iobroker.energyoptimizer
git pull
npm run build
npm pack
```

Install:

``` bash
cd /opt/iobroker

iobroker url /tmp/iobroker.energyoptimizer/iobroker.energyoptimizer-0.1.0.tgz --host IoBroker
iobroker upload energyoptimizer
iobroker restart energyoptimizer.0
```

Verification:

``` bash
iobroker status energyoptimizer.0
iobroker logs --lines 30 | grep energyoptimizer
```

Health:

``` bash
iobroker state get energyoptimizer.0.health.configuredSources
iobroker state get energyoptimizer.0.health.validSources
iobroker state get energyoptimizer.0.health.missingSources
iobroker state get energyoptimizer.0.health.lastPollingTimestamp
iobroker state get energyoptimizer.0.health.lastPollingDurationMs
```

------------------------------------------------------------------------

# Current Status

Implemented:

-   Adapter branding
-   Icon
-   Health monitoring
-   Asset model
-   Multiple PV model
-   Multiple battery model
-   Admin asset table
-   ConfigurationNormalizer
-   Legacy compatibility
-   Clean Architecture

------------------------------------------------------------------------

# Roadmap

## Short Term

1.  ConfigurationNormalizer becomes the only configuration entry point.
2.  EnergySystemFactory consumes normalized assets.
3.  main.ts becomes asset-based.
4.  Polling becomes asset-driven.

## Mid Term

-   Forecast providers
-   Dynamic tariffs
-   Optimization strategies
-   Scheduler
-   Automation

## Long Term

A professional, modular and extensible Home Energy Management System
whose optimization logic operates exclusively on generic energy assets.
