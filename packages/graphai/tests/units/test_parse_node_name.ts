import { GraphAI, graphDataLatestVersion } from "../../src/index";
import { parseNodeName } from "../../src/utils/utils";
import { getDataFromSource } from "../../src/utils/data_source";
import { propFunctions } from "../../src/utils/prop_function";
import copyAgent from "../test_agents/copy_agent";

import test from "node:test";
import assert from "node:assert";

const nodePathCases = [
  { input: ":src", expected: { nodeId: "src" } },
  { input: ":", expected: { nodeId: "" } },
  { input: ":src.a.b.c", expected: { nodeId: "src", propIds: ["a", "b", "c"] } },
  { input: ":src.$0.text", expected: { nodeId: "src", propIds: ["$0", "text"] } },
  { input: ":src.", expected: { nodeId: "src", propIds: [""] } },
  { input: ":src..a", expected: { nodeId: "src", propIds: ["", "a"] } },
  { input: ":.a", expected: { nodeId: "", propIds: ["a"] } },
  { input: ":src.text.split(.).$0.equal(a.b)", expected: { nodeId: "src", propIds: ["text", "split(.)", "$0", "equal(a.b)"] } },
  { input: ":src.a.f(x.y)(z.w).b", expected: { nodeId: "src", propIds: ["a", "f(x.y)(z.w)", "b"] } },
  { input: ":src.a.toUpperCase().b", expected: { nodeId: "src", propIds: ["a", "toUpperCase()", "b"] } },
  { input: ":src.a.equal().b", expected: { nodeId: "src", propIds: ["a", "equal()", "b"] } },
];

for (const { input, expected } of nodePathCases) {
  test(`parseNodeName splits ${JSON.stringify(input)}`, () => {
    assert.deepStrictEqual(parseNodeName(input), expected);
  });
}

// Malformed parentheses are not valid prop functions; these pin the current output so a change is deliberate.
const unbalancedCases = [
  { input: ":src.a.equal(x.y", expected: { nodeId: "src", propIds: ["a", "equal(x.y"] } },
  { input: ":src.a.equal(x.y.b", expected: { nodeId: "src", propIds: ["a", "equal(x.y.b"] } },
  { input: ":src.a).b", expected: { nodeId: "src", propIds: ["a)", "b"] } },
  { input: ":src.a)).b.(c", expected: { nodeId: "src", propIds: ["a))", "b", "(c"] } },
];

for (const { input, expected } of unbalancedCases) {
  test(`parseNodeName keeps malformed parentheses bounded for ${JSON.stringify(input)}`, () => {
    assert.deepStrictEqual(parseNodeName(input), expected);
  });
}

const selfPathCases = [
  { input: ".a", expected: { nodeId: "self", propIds: ["a"] } },
  { input: ".", expected: { nodeId: "self", propIds: [""] } },
  { input: ".a.b", expected: { nodeId: "self", propIds: ["a", "b"] } },
  { input: ".a.equal(1.5)", expected: { nodeId: "self", propIds: ["a", "equal(1.5)"] } },
  { input: "a.b", expected: { value: "a.b" } },
  { input: ":src.a", expected: { value: ":src.a" } },
];

for (const { input, expected } of selfPathCases) {
  test(`parseNodeName self path ${JSON.stringify(input)}`, () => {
    assert.deepStrictEqual(parseNodeName(input, true), expected);
  });
}

const literalCases = ["plain", "a.b", "", 123, true, null, undefined, { a: 1 }, ["x"]];

for (const input of literalCases) {
  test(`parseNodeName treats ${JSON.stringify(input)} as a literal`, () => {
    assert.deepStrictEqual(parseNodeName(input), { value: input });
  });
}

const pathAlphabet = ["a", "b", "1", "$", "_", "-", ".", "."];
const seededRandom = (seed: number) => {
  const state = { value: seed };
  return () => {
    state.value = (state.value * 1103515245 + 12345) & 0x7fffffff;
    return state.value;
  };
};
const GENERATED_PATH_COUNT = 2000;
const MAX_PATH_LENGTH = 12;

test("paths without parentheses split exactly like split('.')", () => {
  const random = seededRandom(1390);
  Array.from({ length: GENERATED_PATH_COUNT }).forEach(() => {
    const path = Array.from({ length: random() % MAX_PATH_LENGTH }, () => pathAlphabet[random() % pathAlphabet.length]).join("");
    const [nodeId, ...propIds] = path.split(".");
    const expected = propIds.length === 0 ? { nodeId } : { nodeId, propIds };
    assert.deepStrictEqual(parseNodeName(`:${path}`), expected, path);
    assert.deepStrictEqual(parseNodeName(`.${path}`, true), { nodeId: "self", propIds: path.split(".") }, path);
  });
});

const resolveCases = [
  { path: ":src.missing.default(1-2)", expected: "1-2" },
  { path: ":src.missing.default(-)", expected: "-" },
  { path: ":src.missing.default(007)", expected: 7 },
  { path: ":src.missing.default(-0.5)", expected: -0.5 },
  { path: ":src.missing.default(.5)", expected: ".5" },
  { path: ":src.missing.default(5.)", expected: "5." },
  { path: ":src.price.equal(1.50)", expected: true },
  { path: ":src.price.equal(abc)", expected: false },
  { path: ":src.price.default(9.9)", expected: undefined },
  { path: ":src.version.split(.)", expected: ["1", "2", "3"] },
  { path: ":src.version.split(.).$2", expected: "3" },
  { path: ":src.model.equal(gpt-4.1).not()", expected: false },
];

for (const { path, expected } of resolveCases) {
  test(`resolves ${path}`, () => {
    const data = { price: 1.5, label: "f(a.b)", version: "1.2.3", model: "gpt-4.1" };
    assert.deepStrictEqual(getDataFromSource(data, parseNodeName(path), propFunctions), expected);
  });
}

// propFunctionRegex rejects ")" inside arguments, so nested parentheses never reach a prop function.
test("prop functions with nested parentheses in the argument are not applied", () => {
  const data = { label: "f(a.b)" };
  assert.deepStrictEqual(parseNodeName(":src.label.equal(f(a.b))"), { nodeId: "src", propIds: ["label", "equal(f(a.b))"] });
  assert.strictEqual(getDataFromSource(data, parseNodeName(":src.label.equal(f(a.b))"), propFunctions), undefined);
});

test("a false dotted condition skips the node and unless runs it", async () => {
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        src: { value: { model: "gpt-4.1" } },
        whenOther: { agent: "copyAgent", if: ":src.model.equal(gpt-4.2)", inputs: { ran: true }, isResult: true },
        unlessOther: { agent: "copyAgent", unless: ":src.model.equal(gpt-4.2)", inputs: { ran: true }, isResult: true },
      },
    },
    { copyAgent },
  );
  assert.deepStrictEqual(await graph.run(), { unlessOther: { ran: true } });
});

test("dotted arguments resolve inside string templates", async () => {
  const graph = new GraphAI(
    {
      version: graphDataLatestVersion,
      nodes: {
        src: { value: { model: "gpt-4.1", price: 1.5 } },
        result: {
          agent: "copyAgent",
          inputs: { text: "match=${:src.model.equal(gpt-4.1)} price=${:src.price.equal(1.5)}" },
          isResult: true,
        },
      },
    },
    { copyAgent },
  );
  assert.deepStrictEqual(await graph.run(), { result: { text: "match=true price=true" } });
});
