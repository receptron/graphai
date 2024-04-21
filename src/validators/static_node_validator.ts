import { StaticNodeData } from "@/type";
import { staticNodeAttributeKeys } from "@/validators/common";

export const staticNodeValidator = (nodeData: StaticNodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (!staticNodeAttributeKeys.includes(key)) {
      throw new Error("Static node does not allow " + key);
    }
  });
  return true;
};
