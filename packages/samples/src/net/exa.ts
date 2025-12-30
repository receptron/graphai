import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.5,
  nodes: {
    query: {
      value: "What is GraphAI?"
    },
    exa: {
      agent: "exaAgent",
      params: {
        numResults: 1
      },
      inputs: {
        query: ":query",
      },
    },
    success: {
      agent: "copyAgent",
      unless: ":exa.onError",
      inputs: { exa_result: ":exa" }
    },
    error: {
      agent: "copyAgent",
      isResult: true,
      if: ":exa.onError",
      inputs: {
        error: ":exa.onError"
      }
    },
    summary_llm: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You are a summarizer. Write a summary of the given document within 100 words.",
      },
      inputs: { prompt: ":success.exa_result.$0.text" },
      isResult: true,
    },
  }
};

export const main = async () => {
  const result = (await graphDataTestRunner(__dirname + "/../", "sample_net_exa.log", graph_data, agents)) as any;
  console.log(result.summary_llm.text);
};
if (process.argv[1] === __filename) {
  main();
}
