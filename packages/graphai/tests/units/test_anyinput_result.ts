import assert from "node:assert";
import test from "node:test";
import { GraphAI, graphDataLatestVersion } from "../../src/index";

test("anyInput preserves non-plain results and drops nullish entries", async () => {
  class Point {
    constructor(
      public x: number,
      public label: string | null,
    ) {}
  }
  const values = {
    point: new Point(1, null),
    bytes: Buffer.from([1, 2, 3, 4]),
    date: new Date("2026-01-01T00:00:00Z"),
    map: new Map([["key", 1]]),
    set: new Set(["value"]),
    error: new Error("example"),
    pattern: /ab/g,
  };
  const nullPrototype = Object.assign(Object.create(null), { kept: 0, empty: null });
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        source: { agent: async () => ({ ...values, nullPrototype, nested: { mixed: [null, values.bytes, undefined, 0], empty: null } }) },
        sink: {
          agent: async ({ input }: { input: Record<string, unknown> }) => {
            for (const [key, value] of Object.entries(values)) {
              assert.strictEqual(input[key], value, key);
            }
            assert.deepStrictEqual(input.nullPrototype, { kept: 0 });
            assert.deepStrictEqual(input.nested, { mixed: [values.bytes, 0] });
            return "preserved";
          },
          inputs: { input: ":source" },
          anyInput: true,
          isResult: true,
        },
      },
    },
    {},
  );
  assert.deepStrictEqual(await graph.run(), { sink: "preserved" });
});
