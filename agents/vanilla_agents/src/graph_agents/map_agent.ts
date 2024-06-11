import { GraphAI, AgentFunction, AgentFunctionInfo, StaticNodeData, assert } from "graphai";

export const mapAgent: AgentFunction<
  {
    namedInputs?: Array<string>;
    limit?: number;
  },
  Record<string, any>,
  any
> = async ({ params, namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo }) => {
  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  assert(!!namedInputs.rows, "mapeAgent: rows property is required in namedInput");
  assert(!!graphData, "mapAgent: graph is required");
  assert(typeof graphData !== "string", "mapAgent: graph is required");
  
  const rows = namedInputs.rows.map((item:any) => item);
  if (params.limit && params.limit < rows.length) {
    rows.length = params.limit; // trim
  }
  
  const { nodes } = graphData;
  const nestedGraphData = { ...graphData, nodes: { ...nodes } }; // deep enough copy

  const nodeIds = Object.keys(namedInputs);
  nodeIds.forEach((nodeId) => {
    const mappedNodeId = (nodeId === "rows") ? "row" : nodeId;
    if (nestedGraphData.nodes[mappedNodeId] === undefined) {
      // If the input node does not exist, automatically create a static node
      nestedGraphData.nodes[mappedNodeId] = { value: namedInputs[nodeId] };
    } else {
      // Otherwise, inject the proper data here (instead of calling injectTo method later)
      (nestedGraphData.nodes[mappedNodeId] as StaticNodeData)["value"] = namedInputs[nodeId];
    }
  });

  try {
    if (nestedGraphData.version === undefined && debugInfo.version) {
      nestedGraphData.version = debugInfo.version;
    }
    const graphs: Array<GraphAI> = rows.map((row: any) => {
      const graphAI = new GraphAI(nestedGraphData, agents || {}, {
        taskManager,
        agentFilters: agentFilters || [],
      });

      graphAI.injectValue("row", row, "__mapAgent_inputs__");
      return graphAI;
    });

    const runs = graphs.map((graph) => {
      return graph.run(false);
    });
    const results = await Promise.all(runs);
    const nodeIds = Object.keys(results[0]);
    // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
    const compositeResult = nodeIds.reduce((tmp: Record<string, Array<any>>, nodeId) => {
      tmp[nodeId] = results.map((result) => {
        return result[nodeId];
      });
      return tmp;
    }, {});

    if (log) {
      const logs = graphs.map((graph, index) => {
        return graph.transactionLogs().map((log) => {
          log.mapIndex = index;
          return log;
        });
      });
      log.push(...logs.flat());
    }
    return compositeResult;
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

const mapAgentInfo: AgentFunctionInfo = {
  name: "mapAgent",
  agent: mapAgent,
  mock: mapAgent,
  samples: [],
  description: "Map Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default mapAgentInfo;
