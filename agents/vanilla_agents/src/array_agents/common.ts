import { assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const arrayValidate = (agentName: string, namedInputs: { array: Array<unknown> }) => {
  assert(!!namedInputs, `${agentName}: namedInputs is UNDEFINED!`);
  assert(isNamedInputs(namedInputs), "popAgent: namedInputs is UNDEFINED!");
  assert(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!`);
  assert(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array`);
};
