import { GraphAI, AgentFunction } from "@/graphai";
import { assert } from "@/utils/utils";

export const mapAgent: AgentFunction<
  {
    resultFrom: string;
    injectionTo?: string;
  },
  {
    contents: Array<any>;
  },
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
    return graph.run(true);
  });
  const results = await Promise.all(runs);
  const contents = results.map((result) => {
    return result[params.resultFrom];
  });
  if (log) {
    const logs = graphs.map((graph, index) => {
      return graph.transactionLogs().map((log) => {
        log.mapIndex = index;
        return log;
      });
    });
    log.push(...logs.flat());
  }
  return { contents };
};
