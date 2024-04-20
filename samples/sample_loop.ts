import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { pushAgent, shiftAgent, slashGPTAgent } from "@/experimental_agents";
import { AgentFunction } from "@/graphai";

export const totalAgent: AgentFunction = async ({ inputs }) => {
  return inputs.reduce((result, input) => {
    Object.keys(input).forEach((key) => {
      const value = input[key];
      if (result[key]) {
        result[key] += value;
      } else {
        result[key] = value;
      }
    });
    return result;
  }, {});
};

const graph_data = {
  loop: {
    while: "people",
  },
  nodes: {
    people: {
      value: ["Steve Jobs", "Elon Musk", "Nikola Tesla"],
      update: "retriever.array",
    },
    result: {
      value: [],
      update: "reducer",
    },
    usage: {
      value: {},
      update: "acountant",
    },
    retriever: {
      agentId: "shift",
      inputs: ["people"],
    },
    query: {
      agentId: "slashgpt",
      params: {
        manifest: {
          prompt: "指定した人について日本語で４００字以内で答えて",
        },
      },
      inputs: ["retriever.item"],
    },
    reducer: {
      agentId: "push",
      inputs: ["result", "query.content"],
    },
    acountant: {
      agentId: "total",
      inputs: ["usage", "query.usage"],
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { slashgpt: slashGPTAgent, push: pushAgent, shift: shiftAgent, total: totalAgent });
  console.log(result.result);
  console.log(result.usage);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
