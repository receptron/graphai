import { mapAgent, stringTemplateAgent } from "@/index";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test map_agent", async () => {
  const result = await mapAgent.agent({
    ...defaultTestContext,
    agents: { mapAgent, stringTemplateAgent },
    graphData: {
      version: 0.5,
      nodes: {
        node2: {
          agent: "stringTemplateAgent",
          params: {
            template: "I love ${0}.",
          },
          inputs: [":row.fruit"],
          isResult: true,
        },
      },
    },
    inputs: [],
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
    agents: { mapAgent, stringTemplateAgent },
    graphData: {
      version: 0.5,
      nodes: {
        node2: {
          agent: "stringTemplateAgent",
          params: {
            template: "I love ${0}.",
          },
          inputs: [":row"],
          isResult: true,
        },
      },
    },
    inputs: [],
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
    agents: { mapAgent, stringTemplateAgent },
    graphData: {
      version: 0.5,
      nodes: {
        node2: {
          agent: "stringTemplateAgent",
          params: {
            template: "${1} ${2} ${0}.",
          },
          inputs: [":row", ":name", ":verb"],
          isResult: true,
        },
      },
    },
    inputs: [],
    params: {
      compositeResult: true,
    },
    namedInputs: { rows: ["apple", "orange", "banana", "lemon"], name: "You", verb: "like" },
  });
  assert.deepStrictEqual(result, {
    node2: ["You like apple.", "You like orange.", "You like banana.", "You like lemon."],
  });
});
