import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import type { GraphAIResult, GraphAIFileName, GraphAIText, GraphAIBaseDirName } from "@graphai/agent_utils";
import fs from "fs";
import path from "path";

export const fileWriteAgent: AgentFunction<
  Partial<GraphAIBaseDirName>,
  GraphAIResult<boolean>,
  GraphAIFileName & Partial<GraphAIText & { buffer?: Buffer }>
> = async ({ namedInputs, params }) => {
  const { baseDir } = params;
  const { text, buffer, file } = namedInputs;
  // assert(!!baseDir, "fileWriteAgent: params.baseDir is UNDEFINED!");
  assert(!!file, "fileWriteAgent: inputs.file is UNDEFINED!");
  assert(!!text || !!buffer, "fileWriteAgent: inputs.file and inputs.buffer are UNDEFINED!");

  const filePath = baseDir ? path.resolve(path.join(baseDir, file)) : file;

  fs.writeFileSync(filePath, text ?? buffer ?? "");

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
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_node_agents/src/node_file_agents/file_write_agent.ts",
  package: "@graphai/vanilla_node_agents",
  license: "MIT",
};
export default fileWriteAgentInfo;
