import "dotenv/config";

import { fileTestRunner } from "../utils/runner";

import { slashGPTAgent } from "@/experimental_agents";
import { arxivAgent, arxiv2TextAgent } from "../utils/agents/arxiv_agent";

import { agentInfoWrapper } from "@/utils/utils";

export const main = async () => {
  const res = await fileTestRunner("/graphs/arxiv.yml", {
    arxivAgent: agentInfoWrapper(arxivAgent),
    arxiv2TextAgent: agentInfoWrapper(arxiv2TextAgent),
    slashGPTAgent,
  });
  console.log(res);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
