import { GraphAI, AgentFunction } from "@/graphai";
import { assert } from "@/utils/utils";

export const mapAgent: AgentFunction<
  {
    injectionTo?: string;
  },
  Record<string, Array<any>>,
  any
> = async ({ params, inputs, agents, log, taskManager, graphData }) => {
  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  assert(graphData !== undefined, "mapAgent: graphData is required");
  const input = Array.isArray(inputs[0]) ? inputs[0] : inputs;
  const graphs: Array<GraphAI> = input.map((data: any) => {
    const graphAI = new GraphAI(graphData, agents || {}, taskManager);
    if (params.injectionTo) {
      graphAI.injectValue(params.injectionTo, data);
    }
    return graphAI;
  });

  const runs = graphs.map((graph) => {
    return graph.run(false);
  });
  const results = await Promise.all(runs);
  const nodeIds = Object.keys(results[0]);
  assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
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
};
