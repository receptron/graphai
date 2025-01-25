import { NodeState } from "graphai";
import { fileReadAgent } from "@/index";

const main = async () => {
  const res = await fileReadAgent.agent({
    params: {
      baseDir: __dirname + "/../files/",
      outputType: "stream",
    },
    namedInputs: {
      file: "test.m4a",
    },
    debugInfo: {
      retry: 1,
      nodeId: "",
      verbose: true,
      state: NodeState.Executing,
      subGraphs: new Map(),
    },
    filterParams: [],
  });

  console.log(res);
};

main();
