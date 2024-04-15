import { AgentFunction } from "@/graphai";

export const bypassAgent: AgentFunction<{}> = async (context) => {
  if (context.inputs.length === 1) {
    return context.inputs[0];
  }
  return context.inputs;
};
export const echoAgent: AgentFunction<{}> = async ({ params }) => {
  return params;
};
export const echoForkIndexAgent: AgentFunction<{}> = async ({ forkIndex }) => {
  return { forkIndex };
};

export const mergeNodeIdAgent: AgentFunction<{}> = async ({ nodeId, inputs }) => {
  console.log("executing", nodeId);
  return inputs.reduce(
    (tmp, input) => {
      return { ...tmp, ...input };
    },
    { [nodeId]: "hello" },
  );
};
