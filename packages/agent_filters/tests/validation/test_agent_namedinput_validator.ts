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

test("test validate filter", async () => {
  const graph_data = {
    version: 0.5,
    nodes: {
      echo: {
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
