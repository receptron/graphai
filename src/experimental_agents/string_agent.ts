import { AgentFunction } from "@/graphai";

export const stringTemplateAgent: AgentFunction<
  {
    template: string;
    inputKey?: string;
  },
  {
    content: string;
  }
> = async ({ nodeId, params, inputs, verbose }) => {
  if (verbose) {
    console.log("executing", nodeId, params);
  }
  const content = inputs.reduce((template, input, index) => {
    return template.replace("${" + index + "}", input[params.inputKey ?? "content"]);
  }, params.template);

  return { content };
};
