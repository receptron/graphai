import * as packages from "@/index";
import { agentTestRunner } from "@receptron/test_utils";
import { defaultTestContext } from "graphai";

const main = async () => {
  const res = await packages.textInputAgent.agent({
    ...defaultTestContext,
    namedInputs: {},
    inputs: [],
    params: {
      // required: true
    }
  });
  console.log(res);
};

main();
