import { fileTestRunner } from "./runner";

import { stringTemplateAgent } from "@/experimental_agents/string_agent";
import { slashGPTAgent } from "@/experimental_agents/slashgpt_agent";

const main = async () => {
  await fileTestRunner("/graphs/slash_gpt.yml", { slashgpt: slashGPTAgent, stringTemplate: stringTemplateAgent });
};
main();
