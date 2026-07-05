const assert = require("node:assert/strict");
const test = require("node:test");
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
});

test("runs the simulation and publishes its mapped snapshot", async () => {
    const input = simulationResult();
    const runtime = { simulate: async () => input };
    const adapter = new AdapterStub();
    const stateManager = new StateManager(adapter);
    const integration = new SimulationRuntimeIntegration(runtime, new SimulationPublicationMapper(), stateManager);

    const snapshot = await integration.run({});

    assert.equal(snapshot.ready, true);
    assert.deepEqual(adapter.states, [
        { id: "simulation.publication.json", value: snapshot.json, ack: true },
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
        new StateManager(adapter),
    );

    const snapshot = await integration.run({});
    const payload = JSON.parse(snapshot.json);

    assert.equal(snapshot.ready, false);
    assert.equal(snapshot.recommendationCount, 0);
    assert.equal(payload.missingSourcesCount, 1);
    assert.deepEqual(payload.recommendations, []);
    assert.deepEqual(payload.warnings, input.warnings);
    assert.equal(adapter.states.at(-1).value, false);
});

test("marks simulation unavailable without writing a foreign state", async () => {
    const adapter = new AdapterStub();
    await new StateManager(adapter).markSimulationUnavailable();

    assert.deepEqual(adapter.states, [{ id: "simulation.ready", value: false, ack: true }]);
});
