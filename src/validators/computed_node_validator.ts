import { ComputedNodeData } from "@/type";
import { computedNodeAttributeKeys, ValidationError } from "@/validators/common";

export const computedNodeValidator = (nodeData: ComputedNodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (!computedNodeAttributeKeys.includes(key)) {
      throw new ValidationError("Computed node does not allow " + key);
    }
  });
  return true;
};
