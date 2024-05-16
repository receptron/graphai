import { AgentFunction } from "@/index";

const processTemplate: any = (template: any, match: string, input: string) => {
  if (typeof template === "string") {
    return template.replace(match, input);
  } else if (Array.isArray(template)) {
    return template.map((item: any) => processTemplate(item, match, input));
  }
  return Object.keys(template).reduce((tmp:any, key:any) => {
    tmp[key] = processTemplate(template[key], match, input);
    return tmp;
  }, {});
};

export const stringTemplateAgent: AgentFunction<
  {
    template: any;
  },
  any,
  string
> = async ({ params, inputs }) => {
  return inputs.reduce((template, input, index) => {
    return processTemplate(template, "${" + index + "}", input);
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
