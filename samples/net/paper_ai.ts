import "dotenv/config";

import { fileTestRunner } from "../runner";

import { slashGPTAgent } from "@/experimental_agents";
import { arxivAgent, arxiv2TextAgent } from "../utils/agents/arxiv_agent";

export const main = async () => {
  const res = await fileTestRunner("/graphs/arxiv.yml", { arxivAgent: arxivAgent, arxiv2TextAgent, slashGPTAgent });
  console.log(res);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
