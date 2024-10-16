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
    map: {
      // This node executes the nested graph concurrently
      agent: "mapAgent",
      inputs: { rows: ":rows" },
      isResult: true,
      graph: {
        nodes: {
          groq: {
            // This node sends the question on the current item to Llama3 on groq and get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: { prompt: ":row.question" },
          },
          answer: {
            agent: (namedInputs: { item: string }) => namedInputs.item,
            inputs: { item: ":groq.choices.$0.message.content" },
            isResult: true,
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
