import { AgentFunction } from "@/index";

type StringTemplate = string | Record<string, string>;
type StringTemplateObject = StringTemplate | StringTemplate[] | Record<string, StringTemplate>;

const processTemplate: any = (template: StringTemplateObject, match: string, input: string) => {
  if (typeof template === "string") {
    return template.replace(match, input);
  } else if (Array.isArray(template)) {
    return template.map((item: StringTemplate) => processTemplate(item, match, input));
  }
  return Object.keys(template).reduce((tmp: any, key: string) => {
    tmp[key] = processTemplate(template[key], match, input);
    return tmp;
  }, {});
};

export const stringTemplateAgent: AgentFunction<
  {
    template: StringTemplateObject;
  },
  StringTemplateObject,
  string
> = async ({ params, inputs }) => {
  if (params.template === undefined) {
    console.warn("warning: stringTemplateAgent no template");
  }
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
  category: ["string"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringTemplateAgentInfo;
