import { GraphAI, AgentFunction, GraphData, StaticNodeData } from "graphai";
import { assert } from "graphai/lib/utils/utils";

// This function allows us to use one of inputs as the graph data for this nested agent,
// which is equivalent to "eval" of JavaScript.
export const getNestedGraphData = (graphData: GraphData | string | undefined, inputs: Array<any>): GraphData => {
  assert(graphData !== undefined, "nestedAgent: graphData is required");
  if (typeof graphData === "string") {
    const regex = /^\$(\d+)$/;
    const match = graphData.match(regex);
    if (match) {
      const index = parseInt(match[1], 10);
      if (index < inputs.length) {
        return inputs[index] as GraphData;
      }
    }
    assert(false, `getNestedGraphData: Invalid graphData string: ${graphData}`);
  }
  return graphData;
};

export const nestedAgent: AgentFunction<{
  namedInputs?: Array<string>;
}> = async ({ params, inputs, agents, log, taskManager, graphData, agentFilters }) => {
  if (taskManager) {
    const status = taskManager.getStatus(false);
    assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
  }

  const nestedGraphData = getNestedGraphData(graphData, inputs);

  const namedInputs = params.namedInputs ?? inputs.map((__input, index) => `$${index}`);
  namedInputs.forEach((nodeId, index) => {
    if (nestedGraphData.nodes[nodeId] === undefined) {
      // If the input node does not exist, automatically create a static node
      nestedGraphData.nodes[nodeId] = { value: inputs[index] };
    } else {
      // Otherwise, inject the proper data here (instead of calling injectTo method later)
      (nestedGraphData.nodes[nodeId] as StaticNodeData)["value"] = inputs[index];
    }
  });

  try {
    const graphAI = new GraphAI(nestedGraphData, agents || {}, {
      taskManager,
      agentFilters,
    });

    const results = await graphAI.run(false);
    log?.push(...graphAI.transactionLogs());
    return results;
  } catch (error) {
    if (error instanceof Error) {
      return {
        onError: {
          message: error.message,
          error,
        },
      };
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
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default nestedAgentInfo;
