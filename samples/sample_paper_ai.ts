import path from "path";
import * as fs from "fs";

import { GraphAI } from "@/graphai";
import { readGraphaiData } from "~/utils/file_utils";

import { slashGPTAgent } from "@/experimental_agents/slashgpt_agent";
import { arxivAgent, arxiv2TextAgent } from "./agents/arxiv_agent";

const runAgent = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, { arxivAgent: arxivAgent, arxiv2TextAgent, slashGPTAgent });
  const results = (await graph.run());
  const log_path = path.resolve(__dirname) + "/../tests/logs/sample_paper_ai.log";
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  console.log(results.slashGPTAgent?.content);
};

const main = async () => {
  await runAgent("/graphs/arxiv.yml");
  console.log("COMPLETE 1");
};
main();
