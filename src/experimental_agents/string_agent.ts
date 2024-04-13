import { AgentFunction } from "@/graphai";

export const stringTemplateAgent: AgentFunction<{ template: string; inputKey?: string }, { content: string }> = async (context) => {
  console.log("executing", context.nodeId, context.params);
  const content = context.inputs.reduce((template, input, index) => {
    return template.replace("${" + index + "}", input[context.params.inputKey ?? "content"]);
  }, context.params.template);

  return { content };
};
