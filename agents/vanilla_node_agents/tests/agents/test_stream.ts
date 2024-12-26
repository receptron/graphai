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
    },
    filterParams: [],
  });

  console.log(res);
};

main();
