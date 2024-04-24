import { GraphAI, GraphData, AgentFunction } from "@/graphai";
import { assert } from "@/utils/utils";

export const nestedAgent: AgentFunction<{
  graph: GraphData;
  resultFrom: string;
  injectionTo?: Array<string>;
}> = async ({ params, inputs, agents, log, taskManager }) => {
  if (taskManager) {
    const status = taskManager.getStatus(false);
    assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
  }

  const graph = new GraphAI(params.graph, agents || {}, taskManager);

  try {
    // Inject inputs to specified source nodes
    (params.injectionTo ?? []).forEach((injectToNodeId, index) => {
      graph.injectValue(injectToNodeId, inputs[index]);
    });
    const results = await graph.run();
    log?.push(...graph.transactionLogs());
    return results[params.resultFrom];
  } catch (error) {
    log?.push(...graph.transactionLogs());
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};
