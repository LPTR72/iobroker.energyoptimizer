const assert = require("node:assert/strict");
const test = require("node:test");
const { SimulationPublicationMapper } = require("../build/lib/SimulationPublication");

function recommendation(type, priority, from = 1_000) {
    return {
        type,
        priority,
        horizon: { from, to: from + 900_000 },
        reason: { code: "pv_surplus", description: `Reason for ${type}` },
    };
}

function result(overrides = {}) {
    return {
        generatedAt: 1_000,
        configuredSourcesCount: 2,
        validSourcesCount: 2,
        missingSourcesCount: 0,
        analysis: { timestamp: 1_000, marker: "analysis" },
        prediction: { generatedAt: 1_000, marker: "prediction" },
        situations: [{ type: "pv_surplus", severity: "medium" }],
        recommendations: [],
        warnings: [],
        ...overrides,
    };
}

test("maps an empty simulation result to a ready publication snapshot", () => {
    const snapshot = new SimulationPublicationMapper().map(result());

    assert.equal(snapshot.ready, true);
    assert.equal(snapshot.recommendationCount, 0);
    assert.equal(snapshot.best, null);
    assert.deepEqual(snapshot.recommendations, []);
    assert.equal(snapshot.warningCount, 0);
});

test("selects the highest-priority recommendation deterministically", () => {
    const mapper = new SimulationPublicationMapper();
    const recommendations = [
        recommendation("reduce_grid_import", "medium"),
        recommendation("increase_self_consumption", "critical", 2_000),
        recommendation("avoid_feed_in", "critical", 1_000),
    ];

    const first = mapper.map(result({ recommendations }));
    const second = mapper.map(result({ recommendations: [...recommendations].reverse() }));

    assert.equal(first.best.type, "avoid_feed_in");
    assert.deepEqual(first.recommendations, second.recommendations);
    assert.equal(first.json, second.json);
});

test("publishes missing sources and warnings explicitly", () => {
    const snapshot = new SimulationPublicationMapper().map(
        result({
            validSourcesCount: 1,
            missingSourcesCount: 1,
            warnings: [
                {
                    code: "incomplete_source_data",
                    message: "A source is missing.",
                    missingSourceIds: ["source.z", "source.a"],
                },
            ],
        }),
    );

    assert.equal(snapshot.ready, false);
    assert.equal(snapshot.missingSourcesCount, 1);
    assert.equal(snapshot.warningCount, 1);
    assert.deepEqual(snapshot.warnings[0].missingSourceIds, ["source.a", "source.z"]);
});

test("includes the complete simulation payload as JSON", () => {
    const input = result({ recommendations: [recommendation("avoid_feed_in", "high")] });
    const payload = JSON.parse(new SimulationPublicationMapper().map(input).json);

    assert.deepEqual(payload.analysis, input.analysis);
    assert.deepEqual(payload.prediction, input.prediction);
    assert.deepEqual(payload.situations, input.situations);
    assert.deepEqual(payload.recommendations, input.recommendations);
    assert.deepEqual(payload.warnings, input.warnings);
});

test("does not mutate the simulation result", () => {
    const input = result({
        recommendations: [recommendation("reduce_grid_import", "medium"), recommendation("avoid_feed_in", "high")],
        warnings: [
            {
                code: "incomplete_source_data",
                message: "Sources are missing.",
                missingSourceIds: ["source.z", "source.a"],
            },
        ],
    });
    const before = structuredClone(input);

    new SimulationPublicationMapper().map(input);

    assert.deepEqual(input, before);
});
