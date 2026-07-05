const assert = require("node:assert/strict");
const test = require("node:test");
const { RecommendationProjectionMapper } = require("../build/lib/RecommendationProjection");

function recommendation() {
    return {
        type: "avoid_feed_in",
        priority: "high",
        horizon: { from: 1_000, to: 2_000 },
        reason: { code: "grid_export", description: "Avoid exporting available surplus." },
    };
}

function snapshot(overrides = {}) {
    return {
        generatedAt: 1_000,
        ready: true,
        configuredSourcesCount: 2,
        validSourcesCount: 2,
        missingSourcesCount: 0,
        warningCount: 0,
        warnings: [],
        recommendationCount: 0,
        recommendations: [],
        best: null,
        json: "{}",
        ...overrides,
    };
}

test("projects an empty recommendation state", () => {
    assert.deepEqual(new RecommendationProjectionMapper().map(snapshot()), {
        available: false,
        count: 0,
        bestType: "",
        bestPriority: "",
        bestReason: "",
        bestValidFrom: 0,
        bestValidTo: 0,
    });
});

test("projects the best recommendation into structured values", () => {
    const best = recommendation();
    const projection = new RecommendationProjectionMapper().map(
        snapshot({ recommendationCount: 2, recommendations: [best], best }),
    );

    assert.deepEqual(projection, {
        available: true,
        count: 2,
        bestType: "avoid_feed_in",
        bestPriority: "high",
        bestReason: "Avoid exporting available surplus.",
        bestValidFrom: 1_000,
        bestValidTo: 2_000,
    });
});

test("suppresses recommendations from a publication that is not ready", () => {
    const best = recommendation();
    const projection = new RecommendationProjectionMapper().map(
        snapshot({ ready: false, recommendationCount: 1, recommendations: [best], best }),
    );

    assert.equal(projection.available, false);
    assert.equal(projection.count, 0);
    assert.equal(projection.bestType, "");
});
