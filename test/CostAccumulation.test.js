const assert = require("node:assert/strict");
const test = require("node:test");
const { StateManager } = require("../build/lib/StateManager");
const { TariffEngine } = require("../build/lib/TariffEngine");

class AdapterStub {
    constructor(initialStates = {}) {
        this.currentStates = new Map(Object.entries(initialStates));
        this.writes = [];
    }

    async getStateAsync(id) {
        return this.currentStates.has(id) ? { val: this.currentStates.get(id) } : null;
    }

    async setStateAsync(id, value, ack) {
        this.currentStates.set(id, value);
        this.writes.push({ id, value, ack });
    }
}

test("calculates the fixed-tariff interval cost for 120 W over 60 seconds", () => {
    const intervalKwh = TariffEngine.calculateIntervalKwh(120, 60);
    const intervalCostEuro = TariffEngine.calculateIntervalCostEuro(intervalKwh, 37.68);

    assert.equal(intervalKwh, 0.002);
    assert.ok(Math.abs(intervalCostEuro - 0.0007536) < Number.EPSILON);
});

test("accumulates the interval cost in both current-tariff cost states", async () => {
    const adapter = new AdapterStub({
        "costs.today.currentTariffEuro": 0.091234,
        "costs.month.currentTariffEuro": 0.091234,
    });
    const intervalCostEuro = TariffEngine.calculateIntervalCostEuro(
        TariffEngine.calculateIntervalKwh(120, 60),
        37.68,
    );

    await new StateManager(adapter).addCost(intervalCostEuro);

    assert.deepEqual(adapter.writes, [
        { id: "costs.today.currentTariffEuro", value: 0.091988, ack: true },
        { id: "costs.month.currentTariffEuro", value: 0.091988, ack: true },
    ]);
});

test("does not write zero or negative cost increments", async () => {
    const adapter = new AdapterStub();
    const stateManager = new StateManager(adapter);

    await stateManager.addCost(0);
    await stateManager.addCost(-0.001);

    assert.deepEqual(adapter.writes, []);
});
