import "dotenv/config";

import { fileTestRunner } from "../utils/runner";
import * as agents from "@graphai/agents";

export const main = async () => {
  const result = await fileTestRunner("/llm/slash_gpt.yml", agents);
  console.log(result.node3);
  console.log(result.node5);
};

if (process.argv[1] === __filename) {
  main();
}
