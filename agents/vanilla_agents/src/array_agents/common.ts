import { assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";

export const arrayValidate = (agentName: string, namedInputs: { array: Array<unknown> }, extra_message: string = "") => {
  assert(isNamedInputs(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
  assert(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
  assert(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
};
