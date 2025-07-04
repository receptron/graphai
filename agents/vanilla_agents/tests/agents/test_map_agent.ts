import { mapAgent, stringTemplateAgent, copyAgent } from "../../src/index";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test map_agent", async () => {
  const result = await mapAgent.agent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { mapAgent, stringTemplateAgent },
      graphData: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${item}.",
            },
            inputs: { item: ":row.fruit" },
            isResult: true,
          },
        },
      },
      graphOptions: {},
    },
    params: {
      compositeResult: true,
    },
    namedInputs: { rows: [{ fruit: "apple" }, { fruit: "orange" }] },
  });
  assert.deepStrictEqual(result, {
    node2: ["I love apple.", "I love orange."],
  });
});

test("test map_agent 2", async () => {
  const result = await mapAgent.agent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { mapAgent, stringTemplateAgent },
      graphData: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${item}.",
            },
            inputs: { item: ":row" },
            isResult: true,
          },
        },
      },
      graphOptions: {},
    },
    params: {
      compositeResult: true,
    },
    namedInputs: { rows: ["apple", "orange", "banana", "lemon"] },
  });
  assert.deepStrictEqual(result, {
    node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon."],
  });
});

test("test map_agent 3", async () => {
  const result = await mapAgent.agent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { mapAgent, stringTemplateAgent },
      graphData: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "${b} ${c} ${a}.",
            },
            inputs: { a: ":row", b: ":name", c: ":verb" },
            isResult: true,
          },
        },
      },
      graphOptions: {},
    },
    params: {
      compositeResult: true,
    },
    namedInputs: { rows: ["apple", "orange", "banana", "lemon"], name: "You", verb: "like" },
  });
  assert.deepStrictEqual(result, {
    node2: ["You like apple.", "You like orange.", "You like banana.", "You like lemon."],
  });
});

test("test map_agent 3", async () => {
  const result = await mapAgent.agent({
    ...defaultTestContext,
    forNestedGraph: {
      agents: { mapAgent, copyAgent },
      graphData: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "copyAgent",
            inputs: { a: ":row", b: ":color" },
            isResult: true,
          },
        },
      },
      graphOptions: {},
    },
    params: {
      compositeResult: true,
      expandKeys: ["color"],
    },
    namedInputs: { rows: ["apple", "orange", "banana", "lemon"], color: ["red", "orange", "yellow", "yellow"] },
  });
  assert.deepStrictEqual(result, {
    node2: [
      {
        a: "apple",
        b: "red",
      },
      {
        a: "orange",
        b: "orange",
      },
      {
        a: "banana",
        b: "yellow",
      },
      {
        a: "lemon",
        b: "yellow",
      },
    ],
  });
});
