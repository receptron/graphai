import { AgentFunction } from "@/graphai";

// see example
//  tests/agents/test_string_agent.ts
export const stringTemplateAgent: AgentFunction<
  {
    template: string;
    inputKey?: string;
  },
  {
    content: string;
  }
> = async ({ params, inputs }) => {
  const content = inputs.reduce((template, input, index) => {
    return template.replace("${" + index + "}", input[params.inputKey ?? "content"]);
  }, params.template);

  return { content };
};
