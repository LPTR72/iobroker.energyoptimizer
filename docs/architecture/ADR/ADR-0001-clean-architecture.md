# ADR-0001: Clean Architecture

## Status

Accepted

## Context

The adapter must support evolving analysis and optimization logic without coupling the domain to ioBroker lifecycle APIs, object IDs, logging, or device vendors.

## Decision

Use Clean Architecture boundaries. Keep deterministic domain models and engines independent from runtime and infrastructure. Put ioBroker state access, lifecycle, providers, and future execution adapters at the edges.

## Consequences

Core logic is portable and easy to test. Boundary adapters require explicit translation, and runtime integration is a separate reviewed step rather than an implicit side effect of domain work.
