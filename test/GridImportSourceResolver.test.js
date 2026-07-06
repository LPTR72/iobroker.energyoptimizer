const assert = require("node:assert/strict");
const test = require("node:test");
const { GridImportSourceResolver } = require("../build/lib/GridImportSourceResolver");

const resolver = new GridImportSourceResolver();

test("prefers and trims the legacy grid import source", () => {
    assert.equal(
        resolver.resolve({
            sourceGridImportPower: "  legacy.grid.import  ",
            energyAssets: [
                { enabled: true, id: "grid-asset", type: "grid", powerStateId: "asset.grid.import" },
            ],
        }),
        "legacy.grid.import",
    );
});

test("falls back to the first enabled grid asset with a nonblank power state", () => {
    assert.equal(
        resolver.resolve({
            sourceGridImportPower: "   ",
            energyAssets: [
                { enabled: false, id: "disabled", type: "grid", powerStateId: "disabled.grid" },
                { enabled: true, id: "consumer", type: "consumer", powerStateId: "consumer.power" },
                { enabled: true, id: "blank-grid", type: "grid", powerStateId: "   " },
                { enabled: true, id: "first-grid", type: "grid", powerStateId: "  first.grid  " },
                { enabled: true, id: "second-grid", type: "grid", powerStateId: "second.grid" },
            ],
        }),
        "first.grid",
    );
});

test("ignores grid assets that are not explicitly enabled", () => {
    assert.equal(
        resolver.resolve({
            energyAssets: [
                { id: "implicit-disabled", type: "grid", powerStateId: "implicit.grid" },
                { enabled: true, id: "valid", type: "grid", powerStateId: "valid.grid" },
            ],
        }),
        "valid.grid",
    );
});

test("returns undefined when no valid grid import source exists", () => {
    assert.equal(
        resolver.resolve({
            sourceGridImportPower: "",
            energyAssets: [
                { enabled: false, id: "disabled", type: "grid", powerStateId: "disabled.grid" },
                { enabled: true, id: "blank", type: "grid", powerStateId: "" },
                { enabled: true, id: "pv", type: "pv", powerStateId: "pv.power" },
            ],
        }),
        undefined,
    );
});
