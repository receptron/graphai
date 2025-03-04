import { AgentFunctionInfoSample, GraphData, NodeData, DefaultInputData, assert } from "graphai";
export * from "./type";

export const sample2GraphData = (sample: AgentFunctionInfoSample, agentName: string) => {
  const nodes: Record<string, NodeData> = {};
  const inputs = (() => {
    if (Array.isArray(sample.inputs)) {
      Array.from(sample.inputs.keys()).forEach((key) => {
        nodes["sampleInput" + key] = {
          value: sample.inputs[key],
        };
      });
      return Object.keys(nodes).map((k) => ":" + k);
    }
    nodes["sampleInput"] = {
      value: sample.inputs,
    };
    return Object.keys(sample.inputs).reduce((tmp: Record<string, string>, key: string) => {
      tmp[key] = `:sampleInput.` + key;
      return tmp;
    }, {});
  })();

  nodes["node"] = {
    isResult: true,
    agent: agentName,
    params: sample.params,
    inputs: inputs,
    graph: sample.graph,
  };
  const graphData: GraphData = {
    version: 0.5,
    nodes,
  };
  return graphData;
};

export const isNamedInputs = <NamedInput = DefaultInputData>(namedInputs: NamedInput) => {
  return Object.keys(namedInputs || {}).length > 0;
};

export const arrayValidate = (agentName: string, namedInputs: { array: Array<unknown> }, extra_message: string = "") => {
  assert(isNamedInputs(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
  assert(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
  assert(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
};

export const isNull = (data: unknown) => {
  return data === null || data === undefined;
};
