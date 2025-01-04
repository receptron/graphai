import * as vanilla_agent from "@graphai/vanilla";

import { GraphAI, AgentFunctionInfo } from "graphai";

import { sample2GraphData } from "@/index";

import test from "node:test";
import assert from "node:assert";

test("test graph", async () => {
  for await (const agent of Object.values<AgentFunctionInfo>(vanilla_agent)) {
    if (agent.samples && agent.name !== "workerAgent" && agent.name !== "mergeNodeIdAgent") {
      await Promise.all(
        agent.samples.map(async (sample) => {
          const graphData = sample2GraphData(sample, agent.name);
          // console.log( JSON.stringify(graphData, null, 2));
          const graph = new GraphAI(graphData, vanilla_agent);
          const result = await graph.run();

          assert.deepStrictEqual(result["node"], sample.result);
        }),
      );
    }
  }
});
