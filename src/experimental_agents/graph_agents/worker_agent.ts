import { GraphAI, AgentFunction } from "@/index";
import { sleep } from "@/utils/utils";
import { getNestedGraphData } from "./nested_agent";
import { Worker } from "worker_threads";

export const workerAgent: AgentFunction<
  {
  },
  any,
  any
> = async ({ inputs, agents, log, graphData }) => {
  return new Promise((resolve, reject) => {
    const myWorker = new Worker("./lib/experimental_agents/graph_agents/worker.js");
    myWorker.on("message", () => {
      console.log("***************");
      // myWorker.terminate();  
      resolve({ message: "Hello World" });
    });
    myWorker.on('error', reject);
    myWorker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
    myWorker.postMessage(["hello"]);
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
  }],
  description: "Map Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default workerAgentInfo;
