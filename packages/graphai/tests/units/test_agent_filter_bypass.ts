import { GraphAI } from "@/index";
import { AgentFilterFunction } from "@/type";
import { graph_data } from "~/units/graph_data";

import test from "node:test";
import assert from "node:assert";

test("test agent filter bypass", async () => {
  const agent: AgentFilterFunction = async (__context, __next) => {
    return { message: "agentFilter" };
  };
  const graph = new GraphAI(
    graph_data,
    {},
    {
      agentFilters: [{ name: "", agent }],
      bypassAgentIds: ["echoAgent", "copyAgent"],
    },
  );
  const ret = await graph.run(true);
  assert.deepStrictEqual(ret, {
    echo: { message: "agentFilter" },
    copyAgent: { message: "agentFilter" },
    copyAgent2: { message: "agentFilter" },
  });
});
