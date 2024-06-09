import { AgentFunction } from "graphai";
import Ajv from "ajv";

import assert from "node:assert";

const agentInputValidator = <T>(inputSchema: any, namedInputs: T) => {
  const ajv = new Ajv();
  const validateSchema = ajv.compile(inputSchema);
  if (!validateSchema(namedInputs)) {
    throw new Error("schema not matched");
  }
};

type NamedInputType = {
  array: Array<unknown>;
};

export const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>, NamedInputType> = async ({ namedInputs, inputSchema }) => {
  assert(namedInputs, "popAgent: namedInputs is UNDEFINED!");
  agentInputValidator<NamedInputType>(inputSchema, namedInputs);
  
  const array = namedInputs.array.map((item: any) => item); // shallow copy
  const item = array.pop();
  return { array, item };
};

const popAgentInfo = {
  name: "popAgent",
  agent: popAgent,
  mock: popAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to pop an item from",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
    properties: {
      item: {
        type: "any",
        description: "the item popped from the array",
      },
      array: {
        type: "array",
        description: "the remaining array",
      },
    },
  },
  samples: [
    {
      inputs: { array: [1, 2, 3] },
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
    {
      inputs: { array: ["a", "b", "c"] },
      params: {},
      result: {
        array: ["a", "b"],
        item: "c",
      },
    },
    {
      inputs: {
        array: [1, 2, 3],
        array2: ["a", "b", "c"],
      },
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
  ],
  description: "Pop Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default popAgentInfo;
