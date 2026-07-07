# FAQ

## Is this adapter already controlling devices?

No. The current runtime is read-only with respect to external devices and foreign ioBroker states. It does not switch devices, schedule loads, or execute optimization actions.

## What does the adapter currently do?

It reads configured source states, mirrors live energy values, calculates simple fixed-tariff import costs, publishes health information, and exposes read-only diagnostics and recommendation data.

## Why is execution separated from recommendations?

Because a useful recommendation is not the same as a safe device action.

The project deliberately separates analysis, prediction, evaluation, recommendation, planning, and execution. This makes the system easier to test and safer to extend.

## Is the project tied to one vendor?

No. The architecture is vendor-neutral. Vendors and protocols belong at integration boundaries, while the core works with neutral energy assets and contracts.

## Will it support dynamic tariffs?

Dynamic tariffs are planned through provider integration and richer cost models. The current runtime supports fixed-tariff import-cost calculation.

## Will it use historical data?

Yes, this is a planned central capability. The History Service is intended to collect, aggregate, store, and expose historical observations through an implementation-neutral boundary.

## Is the History Service complete?

No. The History Service domain foundation is implemented but still pending architecture review and milestone closure. Runtime collection, SQL integration, retention policy enforcement, and consumers remain future work.

## Why use the ioBroker SQL adapter for history?

The preferred initial direction is to reuse existing ioBroker SQL infrastructure instead of creating an adapter-owned database. This keeps persistence replaceable and avoids coupling the domain model to one storage implementation.

## What is the Simulation Runtime?

The current Simulation Runtime is a narrow read-only runtime integration that publishes diagnostics and recommendation output. It must not be confused with the future first-class Simulation Framework.

## What is the future Simulation Framework?

The future Simulation Framework is a planned architecture capability for replay, accelerated time, scenario testing, demonstrations, benchmarks, and regression testing.

## Can users rely on current state names?

Existing public states and legacy configuration fields are treated as compatibility contracts. Changes require explicit migration decisions.

## Who is the project for?

The project is for ioBroker users and developers who want transparent, gradual, and safe home-energy optimization rather than opaque automation logic.
