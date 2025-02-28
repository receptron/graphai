import { AgentFunction, AgentFunctionInfo, sleep } from "graphai";

export const streamMockAgent: AgentFunction<{ sleep?: number; message?: string }, { message?: string }, { message: string }> = async ({
  params,
  filterParams,
  namedInputs,
}) => {
  const message = params.message ?? namedInputs.message ?? "";

  for await (const token of message.split("")) {
    if (filterParams.streamTokenCallback) {
      filterParams.streamTokenCallback(token);
    }
    await sleep(params.sleep || 100);
  }

  return { message };
};

// for test and document
const streamMockAgentInfo: AgentFunctionInfo = {
  name: "streamMockAgent",
  agent: streamMockAgent,
  mock: streamMockAgent,
  inputs: {
    anyOf: [
      {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "streaming message",
          },
        },
      },
      {
        type: "array",
      },
    ],
  },
  samples: [
    {
      inputs: {},
      params: { message: "this is params test" },
      result: { message: "this is params test" },
    },
    {
      inputs: { message: "this is named inputs test" },
      params: {},
      result: { message: "this is named inputs test" },
    },
  ],
  description: "Stream mock agent",
  category: ["test"],
  author: "Isamu Arimoto",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
  stream: true,
};

export default streamMockAgentInfo;
