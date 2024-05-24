import * as packages from "@/index";
import { AgentFunctionInfo } from "graphai";
import { agentTestRunner } from "graphai/lib/utils/test_utils";

const main = async () => {
  for await (const agentInfo of Object.values(packages)) {
    await agentTestRunner(agentInfo as AgentFunctionInfo);
  }
};

main();
