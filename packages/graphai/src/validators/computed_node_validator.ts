import { ComputedNodeData } from "../type";
import { computedNodeAttributeKeys, ValidationError } from "./common";

export const computedNodeValidator = (nodeData: ComputedNodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (!computedNodeAttributeKeys.includes(key)) {
      throw new ValidationError("Computed node does not allow " + key);
    }
  });
  if (nodeData.label !== undefined && typeof nodeData.label !== "string") {
    throw new ValidationError("Computed node label must be a string");
  }
  return true;
};
