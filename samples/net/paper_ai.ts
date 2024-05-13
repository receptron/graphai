import "dotenv/config";

import { fileTestRunner } from "../utils/runner";

import { slashGPTAgent } from "@/experimental_agents/packages";
import { arxivAgent, arxiv2TextAgent } from "../utils/agents/arxiv_agent";

import { getAgentInfo } from "@/utils/test_utils";

export const main = async () => {
  const res = await fileTestRunner("/graphs/arxiv.yml", { arxivAgent: getAgentInfo(arxivAgent), arxiv2TextAgent: getAgentInfo(arxiv2TextAgent), slashGPTAgent });
  console.log(res);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
