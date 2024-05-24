import { AgentFunction, AgentFunctionInfo } from "@/index";
import { sleep } from "@/utils/utils";

export const streamMockAgent: AgentFunction = async ({ params, filterParams }) => {
  const message = params.message || "";

  for await (const token of message.split("")) {
    if (filterParams.streamTokenCallback) {
      filterParams.streamTokenCallback(token);
    }
    await sleep(params.sleep || 100);
  }

  return params;
};

// for test and document
const streamMockAgentInfo: AgentFunctionInfo = {
  name: "streamMockAgent",
  agent: streamMockAgent,
  mock: streamMockAgent,
  samples: [
    {
      inputs: [],
      params: { message: "this is test" },
      result: { message: "this is test" },
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
