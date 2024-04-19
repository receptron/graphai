import { GraphData } from "@/type";

export const validateGraphData = (data: GraphData) => {
  if (data.nodes === undefined) {
    return false;
  }
  return true;
};
