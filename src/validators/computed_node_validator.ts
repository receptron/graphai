import { NodeData } from "@/type";
import { computedNodeAttributeKeys } from "@/validators/common";

export const computedNodeValidator = (nodeData: NodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (![...computedNodeAttributeKeys, "dummy"].includes(key)) {
      throw new Error("Computed node does not allow " + key);
    }
  });
  return true;
};
