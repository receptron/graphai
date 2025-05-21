import type { AgentFunction, AgentFunctionInfo, AgentFunctionContext, StaticNodeData, NodeData, GraphData, ResultData, DefaultResultData } from "graphai";
import { GraphAI, assert, graphDataLatestVersion } from "graphai";

import type { GraphAISupressError, GraphAIOnError } from "@graphai/agent_utils";

type NestedAgentGeneratorOption = {
  resultNodeId: string;
};
export const nestedAgentGenerator: (
  graphData: GraphData,
  options?: NestedAgentGeneratorOption,
) => (context: AgentFunctionContext) => Promise<ResultData<DefaultResultData> | GraphAIOnError> = (
  graphData: GraphData,
  options?: NestedAgentGeneratorOption,
) => {
  return async (context: AgentFunctionContext) => {
    const { namedInputs, log, debugInfo, params, forNestedGraph } = context;
    assert(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");

    const { agents, graphOptions, onLogCallback, callbacks } = forNestedGraph;
    const { taskManager } = graphOptions;
    const supressError = params.supressError ?? false;
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

      if (options && options.resultNodeId) {
        return results[options.resultNodeId];
      }
      return results;
    } catch (error) {
      if (error instanceof Error && supressError) {
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

export const nestedAgent: AgentFunction<Partial<GraphAISupressError> & NestedAgentGeneratorOption> = async (context) => {
  const { forNestedGraph, params } = context;
  const { graphData } = forNestedGraph ?? { graphData: { nodes: {} } };
  assert(!!graphData, "No GraphData");

  return await nestedAgentGenerator(graphData, params)(context);
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
    {
      inputs: {
        message: "hello",
      },
      params: {
        resultNodeId: "test",
      },
      result: ["hello"],
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
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/nested_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default nestedAgentInfo;
