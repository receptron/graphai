import "dotenv/config";

import { openAIAgent, openAIMockAgent } from "graphai/lib/experimental_agents/llm_agents/openai_agent";
import { defaultTestContext } from "graphai/lib/utils/test_utils";

export const main = async () => {
  const res = await openAIAgent({
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
