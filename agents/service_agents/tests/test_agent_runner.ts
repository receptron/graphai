import { fetchAgent } from "@/index";
import { agentTestRunner } from "@receptron/test_utils";

const main = async () => {
  // for await (const agentInfo of Object.values(packages)) {
  await agentTestRunner(fetchAgent);
  // }
};

main();
