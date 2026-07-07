# Optimization models

The optimizer direction relies on neutral physical and economic semantics.

## Timing model

The project distinguishes live sampling, historical aggregation, prediction horizon, evaluation time, and later planning windows.

## Efficiency model

Future models should be able to describe conversion losses, battery charge and discharge efficiency, roundtrip efficiency, standby losses, and related physical constraints.

## Cost model

The current runtime supports fixed-tariff import-cost calculation. Future models may include dynamic tariffs, feed-in tariffs, battery wear, opportunity cost, and richer import/export accounting.

## Priority and goal model

Future optimization needs explicit priorities such as minimizing grid import, reducing cost, preserving comfort, protecting batteries, and maximizing self-consumption.

## Why this matters

The optimizer should not make hidden assumptions. Physical behavior, economic context, and user priorities should be modeled explicitly so recommendations can remain explainable.
