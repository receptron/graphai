import { AgentFunction } from "@/graphai";

export const stringTemplateAgent: AgentFunction<{ template: string }, { content: string }> = async (context) => {
  console.log("executing", context.nodeId, context.params);
  const content = context.inputs.reduce((template, input, index) => {
    return template.replace("${" + index + "}", input["content"]);
  }, context.params.template);

  return { content };
};
