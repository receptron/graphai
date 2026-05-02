import { GraphData, ConcurrencyConfig } from "../type";
import { graphDataAttributeKeys, ValidationError } from "./common";
import { isObject, isNull } from "../utils/utils";

const validateConcurrencyValue = (value: unknown, fieldDescription: string) => {
  if (!Number.isInteger(value)) {
    throw new ValidationError(`${fieldDescription} must be an integer`);
  }
  if ((value as number) < 1) {
    throw new ValidationError(`${fieldDescription} must be a positive integer`);
  }
};

const validateConcurrencyConfig = (concurrency: number | ConcurrencyConfig) => {
  if (typeof concurrency === "number") {
    validateConcurrencyValue(concurrency, "Concurrency");
    return;
  }
  if (!isObject(concurrency) || Array.isArray(concurrency)) {
    throw new ValidationError("Concurrency must be an integer");
  }
  if (!("global" in concurrency)) {
    throw new ValidationError("Concurrency object must have a global field");
  }
  validateConcurrencyValue(concurrency.global, "Concurrency.global");
  if (!isNull(concurrency.labels)) {
    if (!isObject(concurrency.labels) || Array.isArray(concurrency.labels)) {
      throw new ValidationError("Concurrency.labels must be an object");
    }
    for (const [labelKey, labelValue] of Object.entries(concurrency.labels)) {
      validateConcurrencyValue(labelValue, `Concurrency.labels.${labelKey}`);
    }
  }
};

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
    validateConcurrencyConfig(data.concurrency);
  }
};
