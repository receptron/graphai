import "dotenv/config";

import { openAIAgent } from "@graphai/agents";
import { openAIMockAgent } from "@graphai/llm_agents/lib/openai_agent";
import { defaultTestContext } from "graphai";

export const main = async () => {
  const res = await openAIAgent.agent({
    ...defaultTestContext,
    inputs: ["日本の歴史について200文字でまとめてください"],
    ...{
      filterParams: {
        streamTokenCallback: (token: string) => {
          console.log(token);
        },
      },
    },
  });
  console.log(JSON.stringify(res));

  const resMock = await openAIMockAgent({
    ...defaultTestContext,
    inputs: ["日本の歴史について200文字でまとめてください"],
    ...{
      filterParams: {
        streamTokenCallback: (token: string) => {
          console.log(token);
        },
      },
    },
  });
  console.log(JSON.stringify(resMock));
};

main();
