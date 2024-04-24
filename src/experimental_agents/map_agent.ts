import { GraphAI, GraphData, AgentFunction } from "@/graphai";
import { assert } from "@/utils/utils";

export const mapAgent: AgentFunction<
  {
    graph: GraphData;
    resultFrom: string;
    injectionTo?: string;
  },
  {
    contents: Array<any>;
  },
  Array<any>
> = async ({ params, inputs, agents, log, taskManager }) => {
  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  const input = inputs[0];
  const graphs: Array<GraphAI> = input.map((data: any) => {
    const graph = new GraphAI(params.graph, agents || {}, taskManager);
    if (params.injectionTo) {
      graph.injectValue(params.injectionTo, data);
    }
    return graph;
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
