import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, gloqAgent, fetchAgent, copyAgent } from "@/experimental_agents";

const graph_data = {
  nodes: {
    GSM8: {
      value: {
        url: "https://datasets-server.huggingface.co/rows",
        query: {
          dataset: "gsm8k",
          config: "main",
          split: "train",
          offset: 0,
          length: 10,
        },
      }
    },
    fetch: {
      agent: "fetchAgent",
      inputs: ["GSM8.url", "GSM8.query"]
    },
    rows: {
      agent: "copyAgent",
      inputs: ["fetch.rows"]
    }
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__filename, graph_data, { gloqAgent, sleeperAgent, fetchAgent, copyAgent });
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
