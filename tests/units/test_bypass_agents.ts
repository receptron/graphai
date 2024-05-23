import { GraphAI } from "@/index";
import { AgentFilterFunction } from "@/type";
import { graph_data } from "~/units/graph_data";

import test from "node:test";
import assert from "node:assert";

test("test graph", async () => {
  const agent: AgentFilterFunction = async (context, next) => {
    return { message: "agentFilter" };
  };
  const graph = new GraphAI(
    graph_data,
    {},
    {
      agentFilters: [{ name: "", agent }],
      bypassAgentIds: ["echoAgent", "bypassAgent"],
    },
  );
  const ret = await graph.run(true);
  assert.deepStrictEqual(ret, {
    echo: { message: "agentFilter" },
    bypassAgent: { message: "agentFilter" },
    bypassAgent2: { message: "agentFilter" },
  });
});
