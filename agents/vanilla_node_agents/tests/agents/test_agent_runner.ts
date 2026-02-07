import * as packages from "../../src/index";
import { agentTestRunner } from "@receptron/test_utils";
import os from "os";

const main = async () => {
  const isWindows = os.platform() === "win32";
  const windowsSkipAgents = ["pathUtilsAgent", "fileReadAgent"];
  for await (const agentInfo of Object.values(packages)) {
    if (isWindows && windowsSkipAgents.includes(agentInfo.name)) {
      console.log(`Skipping ${agentInfo.name} on Windows`);
      continue;
    }
    await agentTestRunner(agentInfo);
  }
};

main();
