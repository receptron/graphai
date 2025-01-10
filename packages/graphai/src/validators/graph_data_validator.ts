import { GraphData } from "../type";
import { graphDataAttributeKeys, ValidationError } from "./common";

export const graphNodesValidator = (data: GraphData) => {
  if (data.nodes === undefined) {
    throw new ValidationError("Invalid Graph Data: no nodes");
  }
  if (typeof data.nodes !== "object") {
    throw new ValidationError("Invalid Graph Data: invalid nodes");
  }
  if (Array.isArray(data.nodes)) {
    throw new ValidationError("Invalid Graph Data: nodes must be object");
  }
  if (Object.keys(data.nodes).length === 0) {
    throw new ValidationError("Invalid Graph Data: nodes is empty");
  }
  Object.keys(data).forEach((key) => {
    if (!graphDataAttributeKeys.includes(key)) {
      throw new ValidationError("Graph Data does not allow " + key);
    }
  });
};
export const graphDataValidator = (data: GraphData) => {
  if (data.loop) {
    if (data.loop.count === undefined && data.loop.while === undefined) {
      throw new ValidationError("Loop: Either count or while is required in loop");
    }
    if (data.loop.count !== undefined && data.loop.while !== undefined) {
      throw new ValidationError("Loop: Both count and while cannot be set");
    }
  }
  if (data.concurrency !== undefined) {
    if (!Number.isInteger(data.concurrency)) {
      throw new ValidationError("Concurrency must be an integer");
    }
    if (data.concurrency < 1) {
      throw new ValidationError("Concurrency must be a positive integer");
    }
  }
};
