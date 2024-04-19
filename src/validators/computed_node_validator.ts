import { NodeData } from "@/type";

export const computedNodeValidator = (nodeData: NodeData) => {
  ["value", "update"].forEach((key) => {
    if (key in nodeData) {
      throw new Error("Computed node does not allow " + key);
    }
  });
};
