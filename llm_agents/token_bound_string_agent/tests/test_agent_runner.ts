import { tokenBoundStringsAgent } from "@/index";
import { agentTestRunner } from "@receptron/test_utils";

const main = async () => {
  await agentTestRunner(tokenBoundStringsAgent);
};

main();
