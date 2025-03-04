import { AgentFunction, AgentFunctionInfo } from "graphai";
import { GraphAIData, GraphAIArray } from "@graphai/agent_utils";
import deepmerge from "deepmerge";

type MergeDataType = Record<string, unknown>;
export const dataObjectMergeTemplateAgent: AgentFunction<{ flatResponse?: boolean }, MergeDataType | GraphAIData<MergeDataType>, GraphAIArray<MergeDataType>> = async ({
  namedInputs,
  params,
}) => {
  const { flatResponse } = params;
  const data = namedInputs.array.reduce((tmp: MergeDataType, input: MergeDataType) => {
    return deepmerge(tmp, input);
  }, {});
  if (flatResponse) {
    return data;
  }
  return { data };
};

// for test and document
const sampleInputs = {
  array: [
    { a: 1, b: 1 },
    { a: 2, b: 2 },
    { a: 3, b: 0, c: 5 },
  ],
};
const sampleParams = {};
const sampleResult = { a: 3, b: 0, c: 5 };

const dataObjectMergeTemplateAgentInfo: AgentFunctionInfo = {
  name: "dataObjectMergeTemplateAgent",
  agent: dataObjectMergeTemplateAgent,
  mock: dataObjectMergeTemplateAgent,
  samples: [
    {
      inputs: { array: [{ content1: "hello" }, { content2: "test" }] },
      params: { flatResponse: true },
      result: {
        content1: "hello",
        content2: "test",
      },
    },
    {
      inputs: { array: [{ content1: "hello" }] },
      params: { flatResponse: true },
      result: {
        content1: "hello",
      },
    },
    {
      inputs: { array: [{ content: "hello1" }, { content: "hello2" }] },
      params: { flatResponse: true },
      result: {
        content: "hello2",
      },
    },
    {
      inputs: sampleInputs,
      params: { flatResponse: true },
      result: sampleResult,
    },
    {
      inputs: { array: [{ a: { b: { c: { d: "e" } } } }, { b: { c: { d: { e: "f" } } } }, { b: { d: { e: { f: "g" } } } }] },
      params: { flatResponse: true },
      result: {
        a: { b: { c: { d: "e" } } },
        b: {
          c: { d: { e: "f" } },
          d: { e: { f: "g" } },
        },
      },
    },

    {
      inputs: { array: [{ content1: "hello" }, { content2: "test" }] },
      params: {},
      result: {
        data: {
          content1: "hello",
          content2: "test",
        },
      },
    },
    {
      inputs: { array: [{ content1: "hello" }] },
      params: {},
      result: {
        data: {
          content1: "hello",
        },
      },
    },
    {
      inputs: { array: [{ content: "hello1" }, { content: "hello2" }] },
      params: {},
      result: {
        data: {
          content: "hello2",
        },
      },
    },
    {
      inputs: sampleInputs,
      params: sampleParams,
      result: {
        data: sampleResult,
      },
    },
    {
      inputs: { array: [{ a: { b: { c: { d: "e" } } } }, { b: { c: { d: { e: "f" } } } }, { b: { d: { e: { f: "g" } } } }] },
      params: {},
      result: {
        data: {
          a: { b: { c: { d: "e" } } },
          b: {
            c: { d: { e: "f" } },
            d: { e: { f: "g" } },
          },
        },
      },
    },
  ],
  description: "Merge object",
  category: ["data"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default dataObjectMergeTemplateAgentInfo;
