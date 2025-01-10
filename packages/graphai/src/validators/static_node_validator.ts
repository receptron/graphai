import { StaticNodeData } from "../type";
import { staticNodeAttributeKeys, ValidationError } from "./common";

export const staticNodeValidator = (nodeData: StaticNodeData) => {
  Object.keys(nodeData).forEach((key) => {
    if (!staticNodeAttributeKeys.includes(key)) {
      throw new ValidationError("Static node does not allow " + key);
    }
  });
  return true;
};
