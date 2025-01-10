import { NodeData, StaticNodeData, ComputedNodeData } from "../type";
import { ValidationError } from "./common";

export const nodeValidator = (nodeData: NodeData) => {
  if ((nodeData as ComputedNodeData).agent && (nodeData as StaticNodeData).value) {
    throw new ValidationError("Cannot set both agent and value");
  }
  // if (!("agent" in nodeData) && !("value" in nodeData)) {
  //   throw new ValidationError("Either agent or value is required");
  // }
  return true;
};
