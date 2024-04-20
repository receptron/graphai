import { NodeData } from "@/type";
import { staticNodeAttributeKeys } from "@/validators/common";

export const staticNodeValidator = (nodeData: NodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (![...staticNodeAttributeKeys, "dummy"].includes(key)) {
      throw new Error("Static node does not allow " + key);
    }
  });
  return true;
};
