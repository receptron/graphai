import "dotenv/config";

import { AgentFunction } from "@/graphai";

import { graphDataTestRunner } from "~/utils/runner";
import { wikipediaAgent } from "./agents/wikipedia";
import { stringTemplateAgent, slashGPTAgent } from "@/experimental_agents";

// see example
//  tests/agents/test_string_agent.ts
export const stringSplitterAgent: AgentFunction<
  {
    chunkSize?: number;
    overlap?: number;
    inputKey?: string;
  },
  {
    content: Array<string>;
  }
> = async ({ params, inputs }) => {
  const source: string = inputs[0][params.inputKey ?? "content"];
  const chunkSize = params.chunkSize ?? 2048;
  const overlap = params.overlap ?? Math.floor(chunkSize / 8);
  const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
  const content = new Array(count).fill(undefined).map((_, i) => {
    const startIndex = i * (chunkSize - overlap);
    return source.substring(startIndex, startIndex + chunkSize);
  });

  return { content, count, chunkSize, overlap };
};

const graph_data = {
  nodes: {
    title: {
      value: {
        content: "スティーブ・ジョブズ",
      },
    },
    wikipedia: {
      inputs: ["title"],
      agentId: "wikipediaAgent",
      params: {
        inputKey: "content",
        lang: "ja",
      },
    },
    chunks: {
      agentId: "stringSplitterAgent",
      params: {
        chunkSize: 2048,
      },
      inputs: ["wikipedia"]
    }
    /*
    queryBuilder: {
      agentId: "stringTemplateAgent",
      inputs: ["title", "wikipedia"],
      params: {
        template: "下の情報を使って${0}についての最新の情報を書いて。\n\n${1}",
      },
    },
    query: {
      agentId: "slashGPTAgent",
      inputs: ["queryBuilder"]      
    }
    */
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, { stringSplitterAgent, stringTemplateAgent, slashGPTAgent, wikipediaAgent });
  console.log(result.chunks);
  console.log("COMPLETE 1");
};
if (process.argv[1] === __filename) {
  main();
}
