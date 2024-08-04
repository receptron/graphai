import { AgentFunction, AgentFunctionInfo } from "@/index";

export const bypassNamedAgent: AgentFunction<{ flat?: number; firstElement?: boolean }> = async ({ params, namedInputs }) => {
  return namedInputs;
};

// for test and document
const bypassNamedAgentInfo: AgentFunctionInfo = {
  name: "bypassNamedAgent",
  agent: bypassNamedAgent,
  mock: bypassNamedAgent,
  samples: [],
  description: "bypass agent",
  category: ["test"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};

export default bypassNamedAgentInfo;
