import { AgentFunction } from "@/graphai";
import { AgentFunctionInfo } from "@/type";
import { sleep } from "@/utils/utils";

export const streamMockAgent: AgentFunction = async ({ params, filterParams }) => {
  const message = params.message;

  for await (const token of message.split("")) {
    if (filterParams.streamCallback) {
      filterParams.streamCallback(token);
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
  samples: [],
  description: "Sstream mock agent",
  category: [],
  author: "xSatoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default streamMockAgentInfo;
