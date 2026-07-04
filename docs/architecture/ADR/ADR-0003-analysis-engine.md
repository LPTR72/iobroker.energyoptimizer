# ADR-0003: Analysis engine

## Status

Accepted

## Context

Raw energy-system state needs a stable, neutral interpretation before forecasting or later optimization stages can reason about it.

## Decision

Use a pure `AnalysisEngine` to transform `EnergySystemState` into `EnergyAnalysis`, including production, consumption, battery flow, grid flow, balance, percentages, and asset availability.

## Consequences

Analysis is deterministic and independently testable. Missing values require safe defaults, and the engine must remain free of polling, logging, and ioBroker access.
