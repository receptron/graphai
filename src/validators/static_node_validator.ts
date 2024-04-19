import { NodeData } from "@/type";

export const staticNodeValidator = (nodeData: NodeData) => {
  ["inputs", "anyInput", "params", "retry", "timeout", "fork", "agentId"].forEach((key) => {
    if (key in nodeData) {
      throw new Error("Static node does not allow " + key);
    }
  });
};
