// set openai key and run ollama (ollama run mxbai-embed-large)
//   yarn run sample tests/agents/run_agent.ts

import "dotenv/config";
import * as packages from "../../src/index";
import { defaultTestContext } from "graphai";

const main = async () => {
  const openai_res = await packages.stringEmbeddingsAgent.agent({
    ...defaultTestContext,
    namedInputs: { array: ["this is a pen", "hello"] },
  });
  console.log(openai_res);

  const ollama_res = await packages.stringEmbeddingsAgent.agent({
    ...defaultTestContext,
    namedInputs: { array: ["this is a pen", "hello"] },
    params: {
      baseURL: "http://localhost:11434/api/embed",
      model: "mxbai-embed-large",
    },
  });
  console.log(ollama_res);
};

main();
