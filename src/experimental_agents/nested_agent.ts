import { GraphAI, GraphData, AgentFunction } from "@/graphai";

export const nestedAgent: AgentFunction<{
  graph: GraphData;
  nodeId: string;
  inputNodes?: Array<string>;
}> = async ({ params, inputs, agents, log }) => {
  const graph = new GraphAI(params.graph, agents);

  try {
    // Inject inputs to specified source nodes
    (params.inputNodes ?? []).forEach((nodeId, index) => {
      graph.injectValue(nodeId, inputs[index]);
    });
    const results = await graph.run();
    log.push(...graph.transactionLogs());
    return results[params.nodeId];
  } catch (error) {
    log.push(...graph.transactionLogs());
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};
