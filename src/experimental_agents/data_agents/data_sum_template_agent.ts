import { AgentFunction } from "@/graphai";

export const dataSumTemplateAgent: AgentFunction<Record<string, any>, number, number> = async ({ inputs }) => {
  return inputs.reduce((tmp, input) => {
    return tmp + input;
  }, 0);
};

export const dataSumTemplateAgentInfo = {
  name: "dataSumTemplateAgent",
  agent: dataSumTemplateAgent,
  mock: dataSumTemplateAgent,
};
export default dataSumTemplateAgentInfo;
