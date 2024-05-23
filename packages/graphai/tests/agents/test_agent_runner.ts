import * as packages from "@/experimental_agents";

import { agentTestRunner } from "@/utils/test_utils";

const main = async () => {
  for (const agentInfo of Object.values(packages)) {
    await agentTestRunner(agentInfo);
  }
};

main();
