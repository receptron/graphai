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
  Array<any>
> = async ({ params, inputs, agents, log, taskManager, graph }) => {
  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  const input = inputs[0];
  const graphs: Array<GraphAI> = input.map((data: any) => {
    const graphObj = new GraphAI(graph!, agents || {}, taskManager);
    if (params.injectionTo) {
      graphObj.injectValue(params.injectionTo, data);
    }
    return graphObj;
  });

  const runs = graphs.map((graph) => {
    return graph.run();
  });
  const results = await Promise.all(runs);
  const contents = results.map((result) => {
    return result[params.resultFrom];
  });
  if (log) {
    const logs = graphs.map((graph) => {
      return graph.transactionLogs();
    });
    log.push(...logs.flat());
  }
  return { contents };
};
