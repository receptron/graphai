import { GraphAI, AgentFunction, AgentFunctionInfo, StaticNodeData, assert } from "graphai";
import { Worker, isMainThread, parentPort } from "worker_threads";
import {
  totalAgent,
  dataSumTemplateAgent,
  propertyFilterAgent,
  copyAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  nestedAgent,
  mapAgent,
  dotProductAgent,
  sortByValuesAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  jsonParserAgent,
} from "../index";

const vanillaAgents = {
  totalAgent,
  dataSumTemplateAgent,
  propertyFilterAgent,
  copyAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  nestedAgent,
  mapAgent,
  dotProductAgent,
  sortByValuesAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  jsonParserAgent,
};

if (!isMainThread && parentPort) {
  const port = parentPort;
  port.on("message", async (data) => {
    const { graphData } = data;
    const graphAI = new GraphAI(graphData, vanillaAgents);
    const result = await graphAI.run();
    port.postMessage(result);
  });
}

export const workerAgent: AgentFunction<null, any, any> = async ({ namedInputs, /* agents, log, */ forNestedGraph }) => {
  const { graphData } = forNestedGraph ?? {};
  assert(!!graphData, "required");
  assert(typeof graphData === "object", "required");

  const nodeIds = Object.keys(namedInputs);
  if (nodeIds.length > 0) {
    nodeIds.forEach((nodeId) => {
      if (graphData.nodes[nodeId] === undefined) {
        // If the input node does not exist, automatically create a static node
        graphData.nodes[nodeId] = { value: namedInputs[nodeId] };
      } else {
        // Otherwise, inject the proper data here (instead of calling injectTo method later)
        (graphData.nodes[nodeId] as StaticNodeData)["value"] = namedInputs[nodeId];
      }
    });
  }

  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + "/worker_agent");
    worker.on("message", (result) => {
      worker.terminate();
      resolve(result);
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
    // copyAgent is required for test case
    worker.postMessage({ graphData });
  });
};

const workerAgentInfo: AgentFunctionInfo = {
  name: "workerAgent",
  agent: workerAgent,
  mock: workerAgent,
  samples: [
    {
      inputs: [],
      params: {},
      result: { message: { text: "May the force be with you" } },
      graph: {
        version: 0.5,
        nodes: {
          source: {
            value: "May the force be with you",
          },
          message: {
            agent: "copyAgent",
            inputs: { text: ":source" },
            isResult: true,
          },
        },
      },
    },
    {
      inputs: ["May the force be with you"],
      params: {},
      result: { message: { text: "May the force be with you" } },
      graph: {
        version: 0.5,
        nodes: {
          source: {
            value: "TypeScript compiler fails without this node for some reason.",
          },
          message: {
            agent: "copyAgent",
            inputs: { text: ":$0" },
            isResult: true,
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
export default workerAgentInfo;
