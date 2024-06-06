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
    map: {
      // This node executes the nested graph concurrently
      agent: "mapAgent",
      inputs: [":rows"],
      isResult: true,
      graph: {
        nodes: {
          groq: {
            // This node sends the question on the current item to Llama3 on groq and get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192",
            },
            inputs: { prompt:":$0.question" },
          },
          answer: {
            agent: (item: string) => item,
            inputs: [":groq.choices.$0.message.content"],
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
