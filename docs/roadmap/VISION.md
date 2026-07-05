# Vision

ioBroker Energy Optimizer aims to become a vendor-neutral, provider-independent energy optimization platform with a runtime-independent core. ioBroker is the first runtime integration, not the domain boundary.

The platform should understand heterogeneous energy assets, analyze current flows, consume interchangeable forecasts, predict future conditions, evaluate situations, recommend strategies, plan safe capability-aware actions, and—only with explicit authorization—execute those actions through replaceable device integrations.

Domain logic models the physical energy system and must remain independent from ioBroker APIs, concrete source adapters, cloud services, protocols, and device vendors. ioBroker, EcoFlow, Tibber, MQTT, Shelly, Anker, and similar systems are integrations around the core, not core concepts. Recommendations should describe device-independent intent so users can combine providers, runtimes, and hardware freely.

The core will use explicit timing, efficiency, cost, constraint, capability, and goal semantics. This allows the same physical model to support different runtimes and integrations without importing their polling assumptions, tariff formats, APIs, or device commands.

The near-term focus is trustworthy analysis, prediction, evaluation, and recommendations. Safety comes before execution: planning, capability checks, constraints, manual overrides, and explicit authorization must exist before any autonomous control is introduced.
