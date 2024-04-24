import { GraphData } from "@/type";
import { graphDataAttributeKeys } from "@/validators/common";

export const graphNodesValidator = (data: GraphData) => {
  if (data.nodes === undefined) {
    throw new Error("Invalid Graph Data: no nodes");
  }
  if (typeof data.nodes !== "object") {
    throw new Error("Invalid Graph Data: invalid nodes");
  }
  if (Array.isArray(data.nodes)) {
    throw new Error("Invalid Graph Data: nodes must be object");
  }
  if (Object.keys(data.nodes).length === 0) {
    throw new Error("Invalid Graph Data: nodes is empty");
  }
  Object.keys(data).forEach((key) => {
    if (!graphDataAttributeKeys.includes(key)) {
      throw new Error("Graph Data does not allow " + key);
    }
  });
};
export const graphDataValidator = (data: GraphData) => {
  if (data.loop) {
    if (data.loop.count === undefined && data.loop.while === undefined) {
      throw new Error("Either count or while is required in loop");
    }
    if (data.loop.count !== undefined && data.loop.while !== undefined) {
      throw new Error("Both A and B cannot be set");
    }
  }
};
