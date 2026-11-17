import { GraphAI, graphDataLatestVersion } from "../../src/index";
import { parseNodeName } from "../../src/utils/utils";
import { getDataFromSource } from "../../src/utils/data_source";
import { propFunctions } from "../../src/utils/prop_function";
import copyAgent from "../test_agents/copy_agent";

import test from "node:test";
import assert from "node:assert";

const cases = [
  { path: "model.equal(gpt-4.1)", props: ["model", "equal(gpt-4.1)"], expected: true },
  { path: "model.equal(gpt-4.2)", props: ["model", "equal(gpt-4.2)"], expected: false },
  { path: "text.split(...)", props: ["text", "split(...)"], expected: ["a", "b"] },
  { path: "text.split(...).$1.toUpperCase()", props: ["text", "split(...)", "$1", "toUpperCase()"], expected: "B" },
];

for (const { path, props, expected } of cases) {
  for (const isSelfNode of [false, true]) {
    test(`property functions preserve dots in ${isSelfNode ? "self" : "node"} path ${path}`, () => {
      const source = parseNodeName(isSelfNode ? `.${path}` : `:src.${path}`, isSelfNode);
      assert.deepStrictEqual(source, { nodeId: isSelfNode ? "self" : "src", propIds: props });
      assert.deepStrictEqual(getDataFromSource({ model: "gpt-4.1", text: "a...b" }, source, propFunctions), expected);
    });
  }
}

const numericCases = [
  { path: ":src.price.equal(1.5)", expected: true },
  { path: ":src.price.equal(1.25)", expected: false },
  { path: ":src.count.equal(2)", expected: true },
  { path: ":src.missing.default(0.5)", expected: 0.5 },
  { path: ":src.missing.default(-1.5)", expected: -1.5 },
  { path: ":src.missing.default(3)", expected: 3 },
  { path: ":src.missing.default(1.2.3)", expected: "1.2.3" },
  { path: ":src.missing.default(gpt-4.1)", expected: "gpt-4.1" },
];

for (const { path, expected } of numericCases) {
  test(`numeric property functions accept decimal arguments in ${path}`, () => {
    assert.deepStrictEqual(getDataFromSource({ price: 1.5, count: 2 }, parseNodeName(path), propFunctions), expected);
  });
}

test("path parsing keeps nested parentheses together before the next property", () => {
  assert.deepStrictEqual(parseNodeName(":src.value.custom(a(b.c).d).next"), {
    nodeId: "src",
    propIds: ["value", "custom(a(b.c).d)", "next"],
  });
});

test("dotted function arguments work in graph inputs and conditions", async () => {
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        src: { value: { model: "gpt-4.1", text: "a...b" } },
        result: {
          agent: "copyAgent",
          inputs: { matches: ":src.model.equal(gpt-4.1)", parts: ":src.text.split(...)" },
          isResult: true,
        },
        conditional: {
          agent: "copyAgent",
          if: ":src.model.equal(gpt-4.1)",
          inputs: { ran: true },
          isResult: true,
        },
      },
    },
    { copyAgent },
  );
  assert.deepStrictEqual(await graph.run(), { result: { matches: true, parts: ["a", "b"] }, conditional: { ran: true } });
});
