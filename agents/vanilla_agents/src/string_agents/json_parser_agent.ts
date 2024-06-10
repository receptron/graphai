import { AgentFunction, AgentFunctionInfo } from "graphai";

export const jsonParserAgent: AgentFunction<
  {
    stringify: boolean;
  },
  any,
  any
> = async ({ params, inputs }) => {
  if (params.stringify) {
    return JSON.stringify(inputs[0], null, 2);
  }
  const match = ("\n" + inputs[0]).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
  if (match) {
    return JSON.parse(match[1]);
  }
  return JSON.parse(inputs[0]);
};

const sample_object = { apple: "red", lemon: "yellow" };
// for test and document
const jsonParserAgentInfo: AgentFunctionInfo = {
  name: "jsonParserAgent",
  agent: jsonParserAgent,
  mock: jsonParserAgent,
  inputs: {
    type: "any",
  },
  output: {
    type: "any",
  },
  samples: [
    {
      inputs: [sample_object],
      params: { stringify: true },
      result: JSON.stringify(sample_object, null, 2),
    },
    {
      inputs: [JSON.stringify(sample_object, null, 2)],
      params: {},
      result: sample_object,
    },
  ],
  description: "Template agent",
  category: ["string"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default jsonParserAgentInfo;
