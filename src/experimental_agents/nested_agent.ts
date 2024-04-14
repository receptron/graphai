import { GraphAI, GraphData, AgentFunction } from "@/graphai";
import { sleeperAgent } from "@/experimental_agents";

// see example
//  tests/agents/test_string_agent.ts
export const nestedAgent: AgentFunction<
  {
    graph: GraphData;
    nodeId: string;
  }
> = async ({ params, inputs }) => {
  const graph = new GraphAI(params.graph, sleeperAgent); // TODO: we need to get agents from the parent

  try {
    const results = await graph.run();
    // TODO: We need to injects inputs
    console.log("**********", results);    
    return results[params.nodeId];
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};
