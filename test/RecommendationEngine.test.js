const assert = require("node:assert/strict");
const test = require("node:test");
const { RecommendationEngine } = require("../build/lib/RecommendationEngine");

function situation(type, overrides = {}) {
    return {
        type,
        severity: "info",
        horizon: { from: 1_000, to: 2_000 },
        ...overrides,
    };
}

function goal(type, priority, overrides = {}) {
    return { type, priority, enabled: true, ...overrides };
}

const engine = new RecommendationEngine();

test("returns no recommendations without relevant evaluations or goals", () => {
    assert.deepEqual(engine.recommend([], [goal("maximize_self_consumption", 80)], []), []);
    assert.deepEqual(
        engine.recommend([situation("forecast_uncertain")], [goal("minimize_cost", 80)], []),
        [],
    );
    assert.deepEqual(
        engine.recommend([situation("pv_surplus")], [goal("maximize_self_consumption", 80, { enabled: false })], []),
        [],
    );
});

test("ranks positive recommendations by goal priority and situation severity", () => {
    const result = engine.recommend(
        [
            situation("pv_surplus", { horizon: { from: 2_000, to: 3_000 } }),
            situation("grid_import", { severity: "warning", horizon: { from: 1_000, to: 2_000 } }),
        ],
        [goal("maximize_self_consumption", 60), goal("minimize_grid_import", 80)],
        [],
    );

    assert.deepEqual(result.map(recommendation => recommendation.type), [
        "reduce_grid_import",
        "increase_self_consumption",
    ]);
    assert.deepEqual(result.map(recommendation => recommendation.priority), ["critical", "medium"]);
});

test("uses deterministic ordering for equally ranked recommendations", () => {
    const situations = [
        situation("grid_export", { horizon: { from: 3_000, to: 4_000 } }),
        situation("pv_surplus", { horizon: { from: 1_000, to: 2_000 } }),
    ];
    const goals = [goal("avoid_feed_in", 70), goal("maximize_self_consumption", 70)];

    const first = engine.recommend(situations, goals, []);
    const second = engine.recommend([...situations].reverse(), [...goals].reverse(), []);

    assert.deepEqual(first, second);
    assert.deepEqual(first.map(recommendation => recommendation.horizon.from), [1_000, 1_000, 3_000]);
    assert.deepEqual(first.map(recommendation => recommendation.type), [
        "avoid_feed_in",
        "increase_self_consumption",
        "avoid_feed_in",
    ]);
});

test("respects the configurable goal relevance threshold", () => {
    const customEngine = new RecommendationEngine({ minimumGoalPriority: 50 });
    const situations = [situation("pv_surplus")];

    assert.deepEqual(customEngine.recommend(situations, [goal("maximize_self_consumption", 49)], []), []);
    assert.equal(customEngine.recommend(situations, [goal("maximize_self_consumption", 50)], []).length, 1);
    assert.throws(
        () => new RecommendationEngine({ minimumGoalPriority: -1 }),
        /minimumGoalPriority must be a finite, non-negative number/,
    );
});

test("honors recommendation-level manual override and time-window constraints", () => {
    const assetSituation = situation("battery_low", { relatedAssetIds: ["battery.home"] });
    const goals = [goal("protect_battery", 90)];

    assert.deepEqual(
        engine.recommend(assetSituation ? [assetSituation] : [], goals, [
            { type: "manual_override", enabled: true, assetId: "battery.home" },
        ]),
        [],
    );
    assert.deepEqual(
        engine.recommend([assetSituation], goals, [
            { type: "time_window", enabled: true, horizon: { from: 3_000, to: 4_000 } },
        ]),
        [],
    );
    assert.equal(
        engine.recommend(
            [situation("grid_import", { horizon: { from: 1_500, to: 1_500 } })],
            [goal("minimize_grid_import", 90)],
            [{ type: "time_window", enabled: true, horizon: { from: 1_000, to: 2_000 } }],
        ).length,
        1,
    );
});

test("does not mutate situations, goals, or constraints", () => {
    const situations = [situation("pv_surplus", { relatedAssetIds: ["pv.roof"] })];
    const goals = [goal("maximize_self_consumption", 80)];
    const constraints = [{ type: "manual_override", enabled: false }];
    const before = JSON.stringify({ situations, goals, constraints });

    engine.recommend(situations, goals, constraints);

    assert.equal(JSON.stringify({ situations, goals, constraints }), before);
});
