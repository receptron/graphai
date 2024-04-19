import { GraphData } from "@/type";

export const validateGraphData = (data: GraphData) => {
  if (data.nodes === undefined) {
    throw new Error("Invalid Graph Data: no nodes");
  }

  return true;
};
