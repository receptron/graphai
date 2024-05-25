import "dotenv/config";

import { openAIAgent } from "@graphai/agents";
import { openAIMockAgent } from "@graphai/agents/lib/llm_agents/openai_agent";
import { defaultTestContext } from "graphai/lib/utils/test_utils";

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
