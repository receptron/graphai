import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";
import { namedInputValidatorFilter } from "@/index";

import test from "node:test";
import assert from "node:assert";

const agentFilters = [
  {
    name: "namedInputValidatorFilter",
    agent: namedInputValidatorFilter,
  },
];

test("test validate filter no input error", async () => {
  const graph_data = {
    version: 0.5,
    nodes: {
      pop: {
        agent: "popAgent",
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  await assert.rejects(
    async () => {
      await graph.run();
    },
    { name: "Error", message: "schema not matched" },
  );
});

test("test validate filter int input error", async () => {
  const graph_data = {
    version: 0.5,
    nodes: {
      inputs: {
        value: 1,
      },
      pop: {
        agent: "popAgent",
        inputs: [":inputs"],
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  await assert.rejects(
    async () => {
      await graph.run();
    },
    { name: "Error", message: "schema not matched" },
  );
});

test("test validate filter array input error", async () => {
  const graph_data = {
    version: 0.5,
    nodes: {
      inputs: {
        value: [1, 2, 3],
      },
      pop: {
        agent: "popAgent",
        inputs: [":inputs"],
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  await assert.rejects(
    async () => {
      await graph.run();
    },
    { name: "Error", message: "schema not matched" },
  );
});

test("test validate filter array input error", async () => {
  const graph_data = {
    version: 0.5,
    nodes: {
      inputs: {
        value: [1, 2, 3],
      },
      pop: {
        agent: "popAgent",
        inputs: { array: ":inputs" },
        isResult: true,
      },
    },
  };

  const graph = new GraphAI(graph_data, { ...agents }, { agentFilters });
  const result = await graph.run();
  assert.deepStrictEqual(result, { pop: { array: [1, 2], item: 3 } });
});
