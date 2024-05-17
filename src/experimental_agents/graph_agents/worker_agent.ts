import { GraphAI, AgentFunction } from "@/index";
import { sleep } from "@/utils/utils";
import { getNestedGraphData } from "./nested_agent";
import { Worker, isMainThread, parentPort } from "worker_threads";

if (!isMainThread && parentPort) {
  const port = parentPort;
  port.on("message", (data)=> {
    const { graphData, agents } = data;
    port.postMessage({ message: "foo" });
  });
}

export const workerAgent: AgentFunction<
  {
  },
  any,
  any
> = async ({ inputs, agents, log, graphData }) => {
  const nestedGraphData = getNestedGraphData(graphData, inputs);

  return new Promise((resolve, reject) => {
    const worker = new Worker("./lib/experimental_agents/graph_agents/worker_agent.js");
    worker.on("message", resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
    worker.postMessage({ graphData: nestedGraphData, agents });
  });
};

const workerAgentInfo = {
  name: "workerAgent",
  agent: workerAgent,
  mock: workerAgent,
  samples: [{
    inputs: ["foo"],
    params: {},
    result: { message: "Hello World"},
    graph: {
      nodes: {
        source: {
          value: "May the force be with you"
        },
        message: {
          agent: "copyAgent",
          inputs: [":source"],
          isResult: true
        }
      }
    }
  }],
  description: "Map Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default workerAgentInfo;
