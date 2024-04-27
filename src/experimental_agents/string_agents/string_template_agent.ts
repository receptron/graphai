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

const sampleInput = ["hello", "test"];
const sampleParams = { template: "${0}: ${1}" };
const sampleResult = { content: "hello: test" };

// for test and document
const stringTemplateAgentInfo = {
  name: "stringTemplateAgent",
  agent: stringTemplateAgent,
  mock: stringTemplateAgent,
  samples: [
    {
      inputs: sampleInput,
      params: sampleParams,
      result: sampleResult,
    },
  ],
  description: "Template agent",
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringTemplateAgentInfo;
