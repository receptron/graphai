import { GraphAI, AgentFunction, AgentFunctionInfo, StaticNodeData, NodeData, assert, graphDataLatestVersion } from "@/index";

export const nestedAgent: AgentFunction<{
  namedInputs?: Array<string>;
}> = async ({ namedInputs, forNestedGraph, log, agentFilters, debugInfo, config }) => {
  const { graphData, agents, graphOptions, onLogCallback, callbacks } = forNestedGraph ?? {};
  const { taskManager } = graphOptions ?? {};
  if (taskManager) {
    const status = taskManager.getStatus(false);
    assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
  }
  assert(!!graphData, "nestedAgent: graph is required");

  const { nodes } = graphData;
  const newNodes = Object.keys(nodes).reduce((tmp: Record<string, NodeData>, key: string) => {
    const node = nodes[key];
    if ("agent" in node) {
      tmp[key] = node;
    } else {
      const { value, update, isResult, console } = node;
      tmp[key] = { value, update, isResult, console };
    }
    return tmp;
  }, {});
  const nestedGraphData = { ...graphData, nodes: newNodes, version: graphDataLatestVersion }; // deep enough copy

  const nodeIds = Object.keys(namedInputs);
  if (nodeIds.length > 0) {
    nodeIds.forEach((nodeId) => {
      if (nestedGraphData.nodes[nodeId] === undefined) {
        // If the input node does not exist, automatically create a static node
        nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
      } else {
        // Otherwise, inject the proper data here (instead of calling injectTo method later)
        if (namedInputs[nodeId] !== undefined) {
          (nestedGraphData.nodes[nodeId] as StaticNodeData)["value"] = namedInputs[nodeId];
        }
      }
    });
  }

  try {
    if (nestedGraphData.version === undefined && debugInfo.version) {
      nestedGraphData.version = debugInfo.version;
    }
    const graphAI = new GraphAI(nestedGraphData, agents || {}, graphOptions);
    // for backward compatibility. Remove 'if' later
    if (onLogCallback) {
      graphAI.onLogCallback = onLogCallback;
    }
    if (callbacks) {
      graphAI.callbacks = callbacks;
    }
    debugInfo.subGraphs.set(graphAI.graphId, graphAI);
    const results = await graphAI.run(false);
    debugInfo.subGraphs.delete(graphAI.graphId);

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

const nestedAgentInfo: AgentFunctionInfo = {
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
