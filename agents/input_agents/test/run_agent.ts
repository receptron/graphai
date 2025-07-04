import * as packages from "../src/index";
import { defaultTestContext } from "graphai";

const main = async () => {
  const res = await packages.textInputAgent.agent({
    ...defaultTestContext,
    namedInputs: {},
    params: {
      // required: true
    }
  });
  console.log(res);
};

main();
