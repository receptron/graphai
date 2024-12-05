import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import fs from "fs";
import path from "path";

export const fileWriteAgent: AgentFunction<
  {
    basePath: string;
  },
  {
    result: boolean;
  },
  {
    text: string;
    fileName: string;
  }
> = async ({ namedInputs, params }) => {
  const { basePath } = params;
  const { text, fileName } = namedInputs;
  assert(!!basePath, "fileWriteAgent: params.basePath is UNDEFINED!");
  assert(!!fileName, "fileWriteAgent: inputs.fileName is UNDEFINED or null data!");

  console.log(basePath, fileName);
  const file = path.resolve(path.join(basePath, fileName));
  fs.writeFileSync(file, text);

  return {
    result: true,
  };
};

const fileWriteAgentInfo: AgentFunctionInfo = {
  name: "fileWriteAgent",
  agent: fileWriteAgent,
  mock: fileWriteAgent,
  inputs: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "text data",
      },
      fileName: {
        type: "string",
        description: "file name",
      },
    },
    required: ["text", "fileName"],
  },
  output: {
    type: "object",
  },
  samples: [
    {
      inputs: { fileName: "write.txt", text: "hello" },
      params: { basePath: __dirname + "/../../tests/files/" },
      result: {
        result: true,
      },
    },
  ],
  description: "Write data to file system",
  category: ["fs"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default fileWriteAgentInfo;
