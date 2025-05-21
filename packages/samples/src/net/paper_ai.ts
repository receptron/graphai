import "dotenv/config";

import { fileTestRunner } from "../utils/runner";

import * as agents from "@graphai/agents";
import { arxivAgent, arxiv2TextAgent } from "../utils/agents/arxiv_agent";

import { agentInfoWrapper } from "graphai";

export const main = async () => {
  const res = await fileTestRunner("/arxiv.yaml", {
    arxivAgent: agentInfoWrapper(arxivAgent),
    arxiv2TextAgent: agentInfoWrapper(arxiv2TextAgent),
    ...agents,
  });
  console.log(res);
  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
