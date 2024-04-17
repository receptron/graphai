import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { pushAgent, shiftAgent, slashGPTAgent } from "@/experimental_agents";

const graph_data = {
  loop: {
    while: "people"
  },
  nodes: {
    people: {
      value: ["Steve Jobs", "Elon Musk", "Nikola Tesla"],
      next: "retriever.array",
    },
    result: {
      value: [],
      next: "reducer",
    },
    retriever: {
      agentId: "shift",
      inputs: ["people"],
    },
    query: {
      agentId: "slashgpt",
      params: {
        manifest: {
          prompt: "指定した人について日本語で４００字以内で答えて"
        }
      },
      inputs: ["retriever.item"]
    },
    reducer: {
      agentId: "push",
      inputs: ["result", "query.content"],
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, 
        { slashgpt: slashGPTAgent, push: pushAgent, shift: shiftAgent });
  console.log(result.result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
  