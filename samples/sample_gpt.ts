import path from "path";
import * as fs from "fs";
import { GraphAI, AgentFunction } from "@/graphai";
import { readGraphaiData } from "~/utils/file_utils";
import { stringTemplateAgent } from "@/experimental_agents/string_agent";
import { slashGPTAgent } from "@/experimental_agents/slashgpt_agent";

const runAgent = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, { slashgpt: slashGPTAgent, stringTemplate: stringTemplateAgent });
  const results = (await graph.run());

  const log_path = path.resolve(__dirname) + "/../tests/logs/" + path.basename(file_path).replace(/\.yml$/, ".log");
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  console.log(results["node5"]["content"]);
};

const main = async () => {
  await runAgent("/graphs/slash_gpt.yml");
};
main();
