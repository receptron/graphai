import * as packages from "../../src/index";
import { agentTestRunner } from "@receptron/test_utils";
import os from "os";

const main = async () => {
  const isWindows = os.platform() === "win32";
  for await (const agentInfo of Object.values(packages)) {
    if (isWindows && agentInfo.name === "pathUtilsAgent") {
      console.log(`Skipping ${agentInfo.name} on Windows (path separator differences)`);
      continue;
    }
    await agentTestRunner(agentInfo);
  }
};

main();
