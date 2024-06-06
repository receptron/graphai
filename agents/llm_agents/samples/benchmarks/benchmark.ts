import "dotenv/config";
import { graphDataTestRunner } from "@graphai/test_utils";
import * as agents from "@graphai/agents";

const graph_data = {
  version: 0.3,
  nodes: {
    GSM8: {
      // This node specifies the URL and query paramters to fetch GSM8K dataset.
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
      // This node fetches the dataset over HTTP.
      agent: "fetchAgent",
      inputs: { url: ":GSM8.url", queryParams: ":GSM8.query" },
    },
    rows: {
      // This node extract the "row" property from each item in the dataset.
      agent: (items: Array<Record<string, any>>) => items.map((item) => item.row),
      inputs: [":fetch.rows"],
    },
    debugOutputRow: {
      agent: (row: Record<string, string>) => console.log(row),
      inputs: [":rows.$0"],
    },
    loop: {
      // This node interate all the items in the dataset using the nested graph
      agent: "nestedAgent",
      inputs: [":rows"],
      isResult: true,
      graph: {
        // This graph continues until the array on node ":$0" becomes empty
        loop: {
          while: ":$0",
        },
        nodes: {
          // This node receives the inputs[0] (data from "rows" node on outer graph) initially
          // then, updated with the data from "retriever" node after each iteration.
          $0: {
            value: undefined,
            update: ":retriever.array",
          },
          // This node accumurate asnwers for each question in the dataset.
          answers: {
            value: [],
            update: ":reducer",
            isResult: true,
          },
          // This node takes the first item from the array from node "$0".
          retriever: {
            agent: "shiftAgent",
            inputs: [":$0"],
          },
          debugOutputQA: {
            agent: (item: Record<string, string>) => console.log(`Q: ${item.question}\nA0: ${item.answer}`),
            inputs: [":retriever.item"],
          },
          groq: {
            // This node sends the question on the current item to Llama3 on groq and get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: [":retriever.item.question"],
          },
          reducer: {
            // This node pushs the answer from Llama3 into the answer array.
            agent: "pushAgent",
            inputs: { array: ":answers", item: ":groq.choices.$0.message.content" },
          },
          debugOutputA: {
            agent: (answer: string) => console.log(`A: ${answer}\n`),
            inputs: [":groq.choices.$0.message.content"],
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents, () => {}, false);
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
