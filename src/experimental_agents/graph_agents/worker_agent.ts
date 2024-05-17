import { GraphAI, AgentFunction } from "@/index";
import { assert } from "@/utils/utils";
import { getNestedGraphData } from "./nested_agent";
import { Worker } from "worker_threads";

const workerFunction = () => {
  //we perform every operation we want in this function right here
  self.onmessage = (event: MessageEvent) => {
    console.log(event.data);
    postMessage('Message has been gotten!');
  };
};
const workerCode = workerFunction.toString();
const index = workerCode.indexOf('{');
const codeBlock = workerCode.slice(index);
let blob = new Blob([codeBlock], { type: 'application/javascript' });
let worker_script = URL.createObjectURL(blob);
console.log(worker_script);

//assert(!!match, "foo");
//console.log(match[1]);

export const workerAgent: AgentFunction<
  {
  },
  any,
  any
> = async ({ inputs, agents, log, graphData }) => {
  const worker = new Worker("./worker.js");
  console.log(worker);
  

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
