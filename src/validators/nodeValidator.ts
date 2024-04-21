import { NodeData, StaticNodeData, ComputedNodeData } from "@/type";

export const nodeValidator = (nodeData: NodeData) => {
  if ((nodeData as ComputedNodeData).agentId && (nodeData as StaticNodeData).value) {
    throw new Error("Cannot set both agentId and value");
  }
  if (!("agentId" in nodeData) && !("value" in nodeData)) {
    throw new Error("Either agentId or value is required");
  }
  return true;
};
