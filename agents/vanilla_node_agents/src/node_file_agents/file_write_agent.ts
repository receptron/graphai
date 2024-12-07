import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import fs from "fs";
import path from "path";

export const fileWriteAgent: AgentFunction<
  {
    baseDir: string;
  },
  {
    result: boolean;
  },
  {
    text: string;
    file: string;
  }
> = async ({ namedInputs, params }) => {
  const { baseDir } = params;
  const { text, file } = namedInputs;
  assert(!!baseDir, "fileWriteAgent: params.baseDir is UNDEFINED!");
  assert(!!file, "fileWriteAgent: inputs.file is UNDEFINED or null data!");

  const filePath = path.resolve(path.join(baseDir, file));
  fs.writeFileSync(filePath, text);

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
      file: {
        type: "string",
        description: "file name",
      },
    },
    required: ["text", "file"],
  },
  output: {
    type: "object",
  },
  samples: [
    {
      inputs: { file: "write.txt", text: "hello" },
      params: { baseDir: __dirname + "/../../tests/files/" },
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
