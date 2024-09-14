import { GraphAI, AgentFunction, AgentFunctionInfo, StaticNodeData, assert, graphDataLatestVersion } from "graphai";

export const mapAgent: AgentFunction<
  {
    limit?: number;
    resultAll?: boolean;
    compositeResult?: boolean;
  },
  Record<string, any>,
  any
> = async ({ params, namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config }) => {
  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  assert(!!namedInputs.rows, "mapAgent: rows property is required in namedInput");
  assert(!!graphData, "mapAgent: graph is required");

  const rows = namedInputs.rows.map((item: any) => item);
  if (params.limit && params.limit < rows.length) {
    rows.length = params.limit; // trim
  }
  const resultAll = params.resultAll ?? false;

  const { nodes } = graphData;
  const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy

  const nodeIds = Object.keys(namedInputs);
  nodeIds.forEach((nodeId) => {
    const mappedNodeId = nodeId === "rows" ? "row" : nodeId;
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
        config,
      });
      graphAI.injectValue("row", row, "__mapAgent_inputs__");
      return graphAI;
    });

    const runs = graphs.map((graph) => {
      return graph.run(resultAll);
    });
    const results = await Promise.all(runs);
    const nodeIds = Object.keys(results[0]);
    // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");

    if (log) {
      const logs = graphs.map((graph, index) => {
        return graph.transactionLogs().map((log) => {
          log.mapIndex = index;
          return log;
        });
      });
      log.push(...logs.flat());
    }

    if (params.compositeResult) {
      const compositeResult = nodeIds.reduce((tmp: Record<string, Array<any>>, nodeId) => {
        tmp[nodeId] = results.map((result) => {
          return result[nodeId];
        });
        return tmp;
      }, {});
      return compositeResult;
    }
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

const mapAgentInfo: AgentFunctionInfo = {
  name: "mapAgent",
  agent: mapAgent,
  mock: mapAgent,
  samples: [
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        compositeResult: true,
      },
      result: {
        test: [[1], [2]],
      },
      graph: {
        nodes: {
          test: {
            agent: "bypassAgent",
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    {
      inputs: {
        rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
      },
      params: {
        compositeResult: true,
      },
      graph: {
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${0}.",
            },
            inputs: [":row"],
            isResult: true,
          },
        },
      },
      result: {
        node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        resultAll: true,
        compositeResult: true,
      },
      result: {
        test: [[1], [2]],
        row: [1, 2],
      },
      graph: {
        nodes: {
          test: {
            agent: "bypassAgent",
            inputs: [":row"],
          },
        },
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        resultAll: true,
        compositeResult: true,
      },
      result: {
        test: [[1], [2]],
        map: [
          {
            test: [[[1]], [[1]]],
          },
          {
            test: [[[2]], [[2]]],
          },
        ],
        row: [1, 2],
      },
      graph: {
        nodes: {
          test: {
            agent: "bypassAgent",
            inputs: [":row"],
          },
          map: {
            agent: "mapAgent",
            inputs: { rows: [":test", ":test"] },
            graph: {
              nodes: {
                test: {
                  isResult: true,
                  agent: "bypassAgent",
                  inputs: [":row"],
                },
              },
            },
          },
        },
      },
    },
  ],
  description: "Map Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default mapAgentInfo;
