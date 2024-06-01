import * as packages from "@/index";
import { agentTestRunner } from "@graphai/test_utils";

const main = async () => {
  for await (const agentInfo of Object.values(packages)) {
    await agentTestRunner(agentInfo);
  }
};

main();
