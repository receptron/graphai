import { AgentFunction } from "@/graphai";

// see example
//  tests/agents/test_string_agent.ts
export const stringTemplateAgent: AgentFunction<
  {
    template: string;
  },
  Record<string, any> | string,
  string
> = async ({ params, inputs }) => {
  const content = inputs.reduce((template, input, index) => {
    return template.replace("${" + index + "}", input);
  }, params.template);

  return { content };
};
