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
  const worker = new Worker("./worker.js");
  worker.postMessage(["hello"]);
  console.log("sleeping...");
  await sleep(5000);
  console.log("terminating...");
  worker.terminate();  
  return { message: "Hello World" };
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
