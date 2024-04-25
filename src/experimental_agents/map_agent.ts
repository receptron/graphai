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
> = async ({ params, inputs, agents, log, taskManager, graphData }) => {
  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  const input = inputs[0];
  const graphs: Array<GraphAI> = input.map((data: any) => {
    const graphAI = new GraphAI(graphData!, agents || {}, taskManager);
    if (params.injectionTo) {
      graphAI.injectValue(params.injectionTo, data);
    }
    return graphAI;
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
