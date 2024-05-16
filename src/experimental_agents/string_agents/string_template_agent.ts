import { AgentFunction } from "@/index";

const foo: any = (template: any, match: string, input: string) => {
  if (typeof template === "string") {
    return template.replace(match, input);
  } else if (Array.isArray(template)) {
    return template.map((item: any) => foo(item, match, input));
  }
  return Object.keys(template).reduce((tmp:any, key:any) => {
    tmp[key] = foo(template[key], match, input);
  }, {});
}
// see example
//  tests/agents/test_string_agent.ts
export const stringTemplateAgent: AgentFunction<
  {
    template: string | Array<string>;
  },
  string | Array<string>,
  string
> = async ({ params, inputs }) => {
  const content = inputs.reduce((template, input, index) => {
    return foo(template, "${" + index + "}", input);
  }, params.template);

  return content;
};

const sampleInput = ["hello", "test"];
const sampleParams = { template: "${0}: ${1}" };
const sampleParamsArray = { template: ["${0}: ${1}", "${1}: ${0}"] };
const sampleResult = "hello: test";
const sampleResultReversed = "test: hello";

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
    {
      inputs: sampleInput,
      params: sampleParamsArray,
      result: [sampleResult, sampleResultReversed],
    },
  ],
  description: "Template agent",
  category: [],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringTemplateAgentInfo;
