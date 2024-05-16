import { AgentFunction } from "@/index";

const foo: any = (template: any, match: string, input: string) => {
  console.log("---", template, match, input);
  if (typeof template === "string") {
    return template.replace(match, input);
  } else if (Array.isArray(template)) {
    return template.map((item: any) => foo(item, match, input));
  }
  return Object.keys(template).reduce((tmp:any, key:any) => {
    console.log("***", template, key);
    const result = foo(template[key], match, input);
    console.log("**-", result, tmp, key);
    tmp[key] = result;
    return tmp;
  }, {});
}
// see example
//  tests/agents/test_string_agent.ts
export const stringTemplateAgent: AgentFunction<
  {
    template: any;
  },
  any,
  string
> = async ({ params, inputs }) => {
  return inputs.reduce((template, input, index) => {
    console.log("~~~", index, input);
    const result = foo(template, "${" + index + "}", input);
    console.log("~~+", result);
    return result;
  }, params.template);
};

const sampleInput = ["hello", "test"];

// for test and document
const stringTemplateAgentInfo = {
  name: "stringTemplateAgent",
  agent: stringTemplateAgent,
  mock: stringTemplateAgent,
  samples: [
    {
      inputs: sampleInput,
      params: { template: "${0}: ${1}" },
      result: "hello: test",
    },
    {
      inputs: sampleInput,
      params: { template: ["${0}: ${1}", "${1}: ${0}"] },
      result: ["hello: test", "test: hello"],
    },
    {
      inputs: sampleInput,
      params: { template: { apple: "${0}", lemon: "${1}" } },
      result: { apple: "hello", lemon: "test" },
    },
    {
      inputs: sampleInput,
      params: { template: [{ apple: "${0}", lemon: "${1}" }] },
      result: [{ apple: "hello", lemon: "test" }],
    },
    {
      inputs: sampleInput,
      params: { template: { apple: "${0}", lemon: ["${1}"] } },
      result: { apple: "hello", lemon: ["test"] },
    },
  ],
  description: "Template agent",
  category: [],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringTemplateAgentInfo;
