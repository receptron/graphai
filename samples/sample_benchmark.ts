import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { sleeperAgent, groqAgent, fetchAgent, copyAgent, nestedAgent } from "@/experimental_agents";

const graph_data = {
  version: 0.2,
  nodes: {
    GSM8: {
      value: {
        url: "https://datasets-server.huggingface.co/rows",
        query: {
          dataset: "gsm8k",
          config: "main",
          split: "train",
          offset: 0,
          length: 3,
        },
      },
    },
    fetch: {
      agent: "fetchAgent",
      inputs: ["GSM8.url", "GSM8.query"],
    },
    rows: {
      agent: (rows: Array<Record<string, any>>) => rows.map((row) => row.row),
      inputs: ["fetch.rows"],
    },
    groq: {
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
      },
      inputs: ["rows.$0.question"],
    },
    output: {
      agent: ((answer:string) => console.log(answer)),
      inputs: ["groq.choices.$0.message.content"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      sleeperAgent,
      fetchAgent,
      copyAgent,
      nestedAgent,
    },
    () => {},
    false,
  );
  console.log("Complete");
};

if (process.argv[1] === __filename) {
  main();
}
