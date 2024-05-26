import { AgentFunction } from "graphai";
import { sleep } from "graphai/lib/utils/utils";
import deepmerge from "deepmerge";

export const sleeperAgent: AgentFunction<{ duration?: number; value?: Record<string, any> }> = async (context) => {
  const { params, inputs } = context;
  await sleep(params?.duration ?? 10);
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};

const sleeperAgentInfo = {
  name: "sleeperAgent",
  agent: sleeperAgent,
  mock: sleeperAgent,
  samples: [],
  description: "sleeper Agent",
  category: ["sleeper"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default sleeperAgentInfo;
