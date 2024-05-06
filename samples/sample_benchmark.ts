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
    debugOutputRow: {
      agent: (row: Record<string, string>) => console.log(row),
      inputs: ["rows.$0"],
    },
    loop: {
      agent: "nestedAgent",
      inputs: ["rows"],
      isResult: true,
      graph: {
        version: 0.2,
        loop: {
          while: "$0",
        },
        nodes: {
          $0: {
            value: undefined,
            update: "retriever.array",
          },
          answers: {
            value: [],
            update: "reducer",
            isResult: true,
          },
          retriever: {
            agent: "shiftAgent",
            inputs: ["$0"],
          },
          debugOutputQA: {
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
          reducer: {
            agent: "pushAgent",
            inputs: ["answers", "groq.choices.$0.message.content"],
          },
          debugOutputA: {
            agent: (answer: string) => console.log(`A: ${answer}\n`),
            inputs: ["groq.choices.$0.message.content"],
          },
        },
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
