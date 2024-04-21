import { GraphAI, GraphData, AgentFunction } from "@/graphai";

export const nestedAgent: AgentFunction<{
  graph: GraphData;
  resultFrom: string;
  injectionTo?: Array<string>;
}> = async ({ params, inputs, agents, log }) => {
  const graph = new GraphAI(params.graph, agents);

  try {
    // Inject inputs to specified source nodes
    (params.injectionTo ?? []).forEach((injectToNodeId, index) => {
      graph.injectValue(injectToNodeId, inputs[index]);
    });
    const results = await graph.run();
    log.push(...graph.transactionLogs());
    return results[params.resultFrom];
  } catch (error) {
    log.push(...graph.transactionLogs());
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};
