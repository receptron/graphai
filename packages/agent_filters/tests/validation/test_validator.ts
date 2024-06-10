import * as agents from "@graphai/agents";
import { agentInputValidator } from "@/index";

import test from "node:test";
// import assert from "node:assert";

test("test validate", async () => {
  for (const agentInfo of Object.values(agents)) {
    if (agentInfo?.inputs && agentInfo?.samples) {
      for (const sample of agentInfo.samples) {
        try {
          agentInputValidator(agentInfo?.inputs, sample.inputs);
        } catch (e) {
          console.log(agentInfo);
          // console.log(e);
        }
      }
    }
  }
});
