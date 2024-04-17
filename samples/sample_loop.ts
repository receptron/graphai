import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { pushAgent, popAgent, slashGPTAgent } from "@/experimental_agents";

const graph_data = {
  loop: {
    while: "source"
  },
  nodes: {
    source: {
      value: ["Steve Jobs", "Elon Musk", "Nikola Tesla"],
      next: "popper.array",
    },
    result: {
      value: [],
      next: "reducer",
    },
    popper: {
      agentId: "pop", // returns { array, item }
      inputs: ["source"],
    },
    query: {
      agentId: "slashgpt",
      inputs: ["popper.item"]
    },
    reducer: {
      agentId: "push",
      inputs: ["result", "query.content"],
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, 
        { slashgpt: slashGPTAgent, push: pushAgent, pop: popAgent });
  console.log(result.result);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
  