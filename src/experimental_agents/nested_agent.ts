import { GraphAI, GraphData, AgentFunction } from "@/graphai";
import { sleeperAgent } from "@/experimental_agents";

// see example
//  tests/agents/test_string_agent.ts
export const nestedAgent: AgentFunction<{
  graph: GraphData;
  nodeId: string;
  inputNodes?: Array<string>;
}> = async ({ params, inputs, agents }) => {
  const graph = new GraphAI(params.graph, agents);

  try {
    (params.inputNodes ?? []).forEach((nodeId, index) => {
      graph.injectResult(nodeId, inputs[index]);
    });
    const results = await graph.run();
    return results[params.nodeId];
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};
