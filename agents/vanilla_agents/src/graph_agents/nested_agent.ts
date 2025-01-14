import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, StaticNodeData, GraphData } from "graphai";
import { GraphAI, assert, graphDataLatestVersion } from "graphai";

export const nestedAgentGenerator: (graphData: GraphData) => (context: AgentFunctionContext) => Promise<any> = (graphData: GraphData) => {
  return async (context: AgentFunctionContext) => {
    const { namedInputs, log, debugInfo, params, forNestedGraph } = context;
    assert(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");

    const { agents, graphOptions, onLogCallback } = forNestedGraph;
    const { taskManager } = graphOptions;
    const throwError = params.throwError ?? false;
    if (taskManager) {
      const status = taskManager.getStatus(false);
      assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
    }
    assert(!!graphData, "nestedAgent: graph is required");

    const { nodes } = graphData;
    const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy

    const nodeIds = Object.keys(namedInputs);
    if (nodeIds.length > 0) {
      nodeIds.forEach((nodeId) => {
        if (nestedGraphData.nodes[nodeId] === undefined) {
          // If the input node does not exist, automatically create a static node
          nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
        } else {
          // Otherwise, inject the proper data here (instead of calling injectTo method later)
          (nestedGraphData.nodes[nodeId] as StaticNodeData)["value"] = namedInputs[nodeId];
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

      const results = await graphAI.run(false);
      log?.push(...graphAI.transactionLogs());
      return results;
    } catch (error) {
      if (error instanceof Error && !throwError) {
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
};

export const nestedAgent: AgentFunction<{ throwError?: boolean }> = async (context) => {
  const { forNestedGraph } = context;
  const { graphData } = forNestedGraph ?? { graphData: { nodes: {} } };

  return await nestedAgentGenerator(graphData)(context);
};

const nestedAgentInfo: AgentFunctionInfo = {
  name: "nestedAgent",
  agent: nestedAgent,
  mock: nestedAgent,
  samples: [
    {
      inputs: {
        message: "hello",
      },
      params: {},
      result: {
        test: ["hello"],
      },
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "messages" },
            inputs: { messages: [":message"] },
            isResult: true,
          },
        },
      },
    },
  ],
  description: "nested Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default nestedAgentInfo;
