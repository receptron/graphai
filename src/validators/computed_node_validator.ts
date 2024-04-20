import { ComputedNodeData } from "@/type";
import { computedNodeAttributeKeys } from "@/validators/common";

export const computedNodeValidator = (nodeData: ComputedNodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (!computedNodeAttributeKeys.includes(key)) {
      throw new Error("Computed node does not allow " + key);
    }
  });
  return true;
};
