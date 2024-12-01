import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import fs from "fs";
import { arrayValidate } from "@graphai/agent_utils";

export const fileReadAgent: AgentFunction<
  {
    basePath: string;
    outputType?: string;
  },
  {
    array: string[] | unknown[];
  },
  Array<never>,
  {
    array: string[];
  }
> = async ({ namedInputs, params }) => {
  const { basePath, outputType } = params;

  arrayValidate("fileReadAgent", namedInputs);
  assert(!!basePath, "fileReadAgent: params.basePath is UNDEFINED!");

  const files = namedInputs.array.map((file: string) => {
    const path = basePath + file;
    const buffer = fs.readFileSync(path);
    if (outputType && outputType === "base64") {
      return buffer.toString("base64");
    }
    if (outputType && outputType === "text") {
      return new TextDecoder().decode(buffer);
    }
    return buffer;
  });
  return {
    array: files,
  };
};

const fileReadAgentInfo: AgentFunctionInfo = {
  name: "fileReadAgent",
  agent: fileReadAgent,
  mock: fileReadAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "file names",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
  },
  samples: [
    {
      inputs: { array: ["test.txt"] },
      params: { basePath: __dirname + "/../../tests/files/" },
      result: {
        array: [Buffer.from([104, 101, 108, 108, 111, 10])],
      },
    },
    {
      inputs: { array: ["test.txt"] },
      params: { basePath: __dirname + "/../../tests/files/", outputType: "base64" },
      result: {
        array: ["aGVsbG8K"],
      },
    },
    {
      inputs: { array: ["test.txt"] },
      params: { basePath: __dirname + "/../../tests/files/", outputType: "text" },
      result: {
        array: ["hello\n"],
      },
    },
  ],
  description: "Read data from file system and returns data",
  category: ["fs"],
  author: "Receptron team",
  repository: "https://github.com/snakajima/graphai",
  license: "MIT",
};
export default fileReadAgentInfo;
