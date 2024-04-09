import path from "path";
import search from "arXiv-api-ts";

import { GraphAI, NodeExecute } from "@/graphai";
import { readGraphaiData } from "~/file_utils";

import { slashGPTAgent } from "./agents/slashgpt_agent";
import { arxivAgent, arxiv2TextAgent } from "./agents/arxiv_agent";

export const parrotingAgent: NodeExecute = async (context) => {
  return {};
};

const runAgent = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, { default: parrotingAgent, arxivAgent: arxivAgent, arxiv2TextAgent, slashGPTAgent });
  const result = await graph.run();
  console.log(result);
};

const main = async () => {
  await runAgent("/graphs/arxiv.yml");
  console.log("COMPLETE 1");
};
main();
