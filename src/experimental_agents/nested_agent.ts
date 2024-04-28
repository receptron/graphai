import { GraphAI, AgentFunction } from "@/graphai";
import { assert } from "@/utils/utils";

export const nestedAgent: AgentFunction<{
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
    const results = await graphAI.run(false);
    log?.push(...graphAI.transactionLogs());
    return results;
  } catch (error) {
    log?.push(...graphAI.transactionLogs());
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    throw error;
  }
};

const nestedAgentInfo = {
  name: "nestedAgent",
  agent: nestedAgent,
  mock: nestedAgent,
  samples: [],
  description: "nested Agent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default nestedAgentInfo;
