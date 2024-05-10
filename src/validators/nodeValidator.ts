import { NodeData, StaticNodeData, ComputedNodeData } from "@/type";

export const nodeValidator = (nodeData: NodeData) => {
  if ((nodeData as ComputedNodeData).agent && (nodeData as StaticNodeData).value) {
    throw new Error("Cannot set both agent and value");
  }
  if (!("agent" in nodeData) && !("value" in nodeData)) {
    throw new Error("Either agent or value is required");
  }
  return true;
};
