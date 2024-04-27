import { GraphAI, GraphData, AgentFunction } from "@/graphai";
import { assert } from "@/utils/utils";

export const nestedAgent: AgentFunction<{
  graph: GraphData;
  resultFrom: string;
  injectionTo?: Array<string>;
}> = async ({ params, inputs, agents, log, taskManager, graphData }) => {
  if (taskManager) {
    const status = taskManager.getStatus(false);
    assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
  }

  assert(graphData !== undefined, "nestedAgent: graphData is required");

  const injectionTo =
    params.injectionTo ??
    inputs.map((__input, index) => {
      return `$${index}`;
    });
  injectionTo.forEach((nodeId) => {
    if (graphData.nodes[nodeId] === undefined) {
      // If the input node does not exist, automatically create a static node
      graphData.nodes[nodeId] = { value: {} };
    }
  });

  const graphAI = new GraphAI(graphData, agents || {}, taskManager);

  try {
    // Inject inputs to specified source nodes
    injectionTo.forEach((injectToNodeId, index) => {
      graphAI.injectValue(injectToNodeId, inputs[index]);
    });
    const results = await graphAI.run(true);
    log?.push(...graphAI.transactionLogs());
    return results[params.resultFrom];
  } catch (error) {
    log?.push(...graphAI.transactionLogs());
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};
