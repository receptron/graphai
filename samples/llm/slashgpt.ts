import "dotenv/config";

import { fileTestRunner } from "../utils/runner";

import { stringTemplateAgent, slashGPTAgent } from "@/experimental_agents";

export const main = async () => {
  const result = await fileTestRunner("/graphs/slash_gpt.yml", { slashgpt: slashGPTAgent, stringTemplate: stringTemplateAgent });
  console.log(result.node3);
  console.log(result.node5);
};

if (process.argv[1] === __filename) {
  main();
}
