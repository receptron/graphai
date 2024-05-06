import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, fetchAgent, shiftAgent, nestedAgent } from "@/experimental_agents";

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
    loop: {
      agent: "nestedAgent",
      inputs: ["rows"],
      graph: {
        version: 0.2,
        loop: {
          while: '$0',
        },
        nodes: {
          $0: {
            value: undefined,
            update: "retriever.array",
          },
          retriever: {
            agent: "shiftAgent",
            inputs: ["$0"],
          },
          outputQA: {
            agent: (item: Record<string, string>) => console.log(`Q: ${item.question}\nA0: ${item.answer}`),
            inputs: ["retriever.item"],
          },
          groq: {
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: ["retriever.item.question"],
          },
          output: {
            agent: (answer: string) => console.log(`A: ${answer}\n`),
            inputs: ["groq.choices.$0.message.content"],
          },
        }
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      shiftAgent,
      fetchAgent,
      nestedAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
