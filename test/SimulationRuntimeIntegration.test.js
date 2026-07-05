const assert = require("node:assert/strict");
const test = require("node:test");
const { RecommendationProjectionMapper } = require("../build/lib/RecommendationProjection");
const { SimulationPublicationMapper } = require("../build/lib/SimulationPublication");
const { SimulationRuntimeIntegration } = require("../build/lib/SimulationRuntimeIntegration");
const { StateManager } = require("../build/lib/StateManager");

function simulationResult(overrides = {}) {
    return {
        generatedAt: 1_000,
        configuredSourcesCount: 2,
        validSourcesCount: 2,
        missingSourcesCount: 0,
        analysis: { timestamp: 1_000 },
        prediction: { generatedAt: 1_000 },
        situations: [],
        recommendations: [],
        warnings: [],
        ...overrides,
    };
}

class AdapterStub {
    constructor() {
        this.objects = [];
        this.states = [];
    }

    async setObjectNotExistsAsync(id, object) {
        this.objects.push({ id, object });
    }

    async setStateAsync(id, value, ack) {
        this.states.push({ id, value, ack });
    }
}

test("creates the read-only simulation publication state", async () => {
    const adapter = new AdapterStub();
    await new StateManager(adapter).createStates();

    const publication = adapter.objects.find(object => object.id === "simulation.publication.json");
    assert.ok(publication);
    assert.equal(publication.object.common.type, "string");
    assert.equal(publication.object.common.role, "json");
    assert.equal(publication.object.common.read, true);
    assert.equal(publication.object.common.write, false);
    assert.deepEqual(JSON.parse(publication.object.common.def), {
        status: "awaiting_first_simulation",
        warnings: [],
        recommendations: [],
    });

    const recommendationIds = [
        "recommendation.available",
        "recommendation.count",
        "recommendation.best.type",
        "recommendation.best.priority",
        "recommendation.best.reason",
        "recommendation.best.validFrom",
        "recommendation.best.validTo",
    ];
    for (const id of recommendationIds) {
        const object = adapter.objects.find(candidate => candidate.id === id);
        assert.ok(object, `Expected ${id} to be created`);
        assert.equal(object.object.common.read, true);
        assert.equal(object.object.common.write, false);
    }
});

test("initializes the publication state with valid JSON while remaining not ready", async () => {
    const adapter = new AdapterStub();
    await new StateManager(adapter).initializeRuntimeStates({});

    const publication = adapter.states.find(state => state.id === "simulation.publication.json");
    const ready = adapter.states.find(state => state.id === "simulation.ready");
    assert.ok(publication);
    assert.deepEqual(JSON.parse(publication.value), {
        status: "awaiting_first_simulation",
        warnings: [],
        recommendations: [],
    });
    assert.equal(publication.ack, true);
    assert.deepEqual(ready, { id: "simulation.ready", value: false, ack: true });
    assert.deepEqual(
        adapter.states.filter(state => state.id.startsWith("recommendation.")),
        [
            { id: "recommendation.available", value: false, ack: true },
            { id: "recommendation.count", value: 0, ack: true },
            { id: "recommendation.best.type", value: "", ack: true },
            { id: "recommendation.best.priority", value: "", ack: true },
            { id: "recommendation.best.reason", value: "", ack: true },
            { id: "recommendation.best.validFrom", value: 0, ack: true },
            { id: "recommendation.best.validTo", value: 0, ack: true },
        ],
    );
});

test("runs the simulation and publishes its mapped snapshot", async () => {
    const input = simulationResult({
        recommendations: [
            {
                type: "avoid_feed_in",
                priority: "high",
                horizon: { from: 1_000, to: 2_000 },
                reason: { code: "grid_export", description: "Avoid exporting available surplus." },
            },
        ],
    });
    const runtime = { simulate: async () => input };
    const adapter = new AdapterStub();
    const stateManager = new StateManager(adapter);
    const integration = new SimulationRuntimeIntegration(
        runtime,
        new SimulationPublicationMapper(),
        new RecommendationProjectionMapper(),
        stateManager,
    );

    const snapshot = await integration.run({});

    assert.equal(snapshot.ready, true);
    assert.deepEqual(adapter.states, [
        { id: "simulation.publication.json", value: snapshot.json, ack: true },
        { id: "recommendation.count", value: 1, ack: true },
        { id: "recommendation.best.type", value: "avoid_feed_in", ack: true },
        { id: "recommendation.best.priority", value: "high", ack: true },
        { id: "recommendation.best.reason", value: "Avoid exporting available surplus.", ack: true },
        { id: "recommendation.best.validFrom", value: 1_000, ack: true },
        { id: "recommendation.best.validTo", value: 2_000, ack: true },
        { id: "recommendation.available", value: true, ack: true },
        { id: "simulation.ready", value: true, ack: true },
    ]);
});

test("publishes incomplete source warnings without recommendations", async () => {
    const input = simulationResult({
        validSourcesCount: 1,
        missingSourcesCount: 1,
        recommendations: [],
        warnings: [
            {
                code: "incomplete_source_data",
                message: "One or more configured source states have no valid numeric value.",
                missingSourceIds: ["source.house"],
            },
        ],
    });
    const adapter = new AdapterStub();
    const integration = new SimulationRuntimeIntegration(
        { simulate: async () => input },
        new SimulationPublicationMapper(),
        new RecommendationProjectionMapper(),
        new StateManager(adapter),
    );

    const snapshot = await integration.run({});
    const payload = JSON.parse(snapshot.json);

    assert.equal(snapshot.ready, false);
    assert.equal(snapshot.recommendationCount, 0);
    assert.equal(payload.missingSourcesCount, 1);
    assert.deepEqual(payload.recommendations, []);
    assert.deepEqual(payload.warnings, input.warnings);
    assert.deepEqual(
        adapter.states.filter(state => state.id.startsWith("recommendation.")),
        [
            { id: "recommendation.count", value: 0, ack: true },
            { id: "recommendation.best.type", value: "", ack: true },
            { id: "recommendation.best.priority", value: "", ack: true },
            { id: "recommendation.best.reason", value: "", ack: true },
            { id: "recommendation.best.validFrom", value: 0, ack: true },
            { id: "recommendation.best.validTo", value: 0, ack: true },
            { id: "recommendation.available", value: false, ack: true },
        ],
    );
    assert.equal(adapter.states.at(-1).value, false);
});

test("clears recommendations when marking simulation unavailable", async () => {
    const adapter = new AdapterStub();
    await new StateManager(adapter).markSimulationUnavailable();

    assert.deepEqual(adapter.states, [
        { id: "recommendation.count", value: 0, ack: true },
        { id: "recommendation.best.type", value: "", ack: true },
        { id: "recommendation.best.priority", value: "", ack: true },
        { id: "recommendation.best.reason", value: "", ack: true },
        { id: "recommendation.best.validFrom", value: 0, ack: true },
        { id: "recommendation.best.validTo", value: 0, ack: true },
        { id: "recommendation.available", value: false, ack: true },
        { id: "simulation.ready", value: false, ack: true },
    ]);
});
