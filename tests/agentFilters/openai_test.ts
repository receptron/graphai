import "dotenv/config";

import { streamopenAIAgent } from "@/experimental_agents/llm_agents/openai_agent";
import { defaultTestContext } from "@/utils/test_utils";
import OpenAI from "openai";

const main = async () => {
  const res = await streamopenAIAgent({
    ...defaultTestContext,
    inputs: ["日本の歴史について200文字でまとめてください"],
    ...{
      filterParams: {
        streamCallback: (token: string) => {
          console.log(token);
        },
      },
    },
  });
  console.log(res);
};

main();
