import { NodeData } from "@/type";

const staticNodeAttributeKeys = ["inputs", "anyInput", "params", "retry", "timeout", "fork", "agentId"];
export const staticNodeValidator = (nodeData: NodeData) => {
  staticNodeAttributeKeys.forEach((key) => {
    if (key in nodeData) {
      throw new Error("Static node does not allow " + key);
    }
  });
};
