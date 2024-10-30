import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const graph_data = {
  version: 0.5,
  nodes: {
    GSM8: {
      // This node specifies the URL and query paramters to fetch GSM8K dataset.
      value: {
        url: "https://datasets-server.huggingface.co/rows",
        query: {
          dataset: "openai/gsm8k",
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
      agent: (namedItems: { array: Array<Record<string, any>> }) => namedItems.array.map((item) => item.row),
      inputs: { array: ":fetch.rows" },
    },
    debugOutputRow: {
      agent: (namedInputs: { row: Record<string, string> }) => console.log(namedInputs.row),
      inputs: { row: [":rows.$0"] },
    },
    loop: {
      // This node interate all the items in the dataset using the nested graph
      agent: "nestedAgent",
      inputs: { rows: ":rows" },
      isResult: true,
      graph: {
        // This graph continues until the array on node ":rows" becomes empty
        loop: {
          while: ":rows",
        },
        nodes: {
          // This node receives the inputs[0] (data from "rows" node on outer graph) initially
          // then, updated with the data from "retriever" node after each iteration.
          rows: {
            value: undefined,
            update: ":retriever.array",
          },
          // This node accumurate asnwers for each question in the dataset.
          answers: {
            value: [],
            update: ":reducer.array",
            isResult: true,
          },
          // This node takes the first item from the array from node "$0".
          retriever: {
            agent: "shiftAgent",
            inputs: { array: ":rows" },
          },
          debugOutputQA: {
            agent: (namedInputs: { item: Record<string, string> }) => console.log(`Q: ${namedInputs.item.question}\nA0: ${namedInputs.item.answer}`),
            inputs: { item: ":retriever.item" },
          },
          groq: {
            // This node sends the question on the current item to Llama3 on groq and get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: { prompt: ":retriever.item.question" },
          },
          reducer: {
            // This node pushs the answer from Llama3 into the answer array.
            agent: "pushAgent",
            inputs: { array: ":answers", item: ":groq.choices.$0.message.content" },
          },
          debugOutputA: {
            agent: (namedInputs: { answer: string }) => console.log(`A: ${namedInputs.answer}\n`),
            inputs: { answer: ":groq.choices.$0.message.content" },
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
