import { GraphData, ConcurrencyConfig } from "../type";
import { graphDataAttributeKeys, ValidationError } from "./common";
import { isPlainObject } from "../utils/utils";

const concurrencyConfigKeys: ReadonlyArray<keyof ConcurrencyConfig> = ["global", "labels"];

const validateConcurrencyValue = (value: unknown, fieldDescription: string) => {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new ValidationError(`${fieldDescription} must be an integer`);
  }
  if (value < 1) {
    throw new ValidationError(`${fieldDescription} must be a positive integer`);
  }
};

const validateConcurrencyConfig = (concurrency: number | ConcurrencyConfig) => {
  if (typeof concurrency === "number") {
    validateConcurrencyValue(concurrency, "Concurrency");
    return;
  }
  if (!isPlainObject(concurrency)) {
    throw new ValidationError("Concurrency must be an integer");
  }
  for (const key of Object.keys(concurrency)) {
    if (!concurrencyConfigKeys.includes(key as keyof ConcurrencyConfig)) {
      throw new ValidationError(`Concurrency object does not allow ${key}`);
    }
  }
  if (!("global" in concurrency)) {
    throw new ValidationError("Concurrency object must have a global field");
  }
  validateConcurrencyValue(concurrency.global, "Concurrency.global");
  // The schema declares labels?: Record<string, number>. undefined is the only
  // sentinel for "absent"; null, arrays, Maps, Dates and other non-plain-object
  // shapes are malformed and would silently disable label enforcement (their
  // Object.entries() yields no string keys).
  if (concurrency.labels !== undefined) {
    if (!isPlainObject(concurrency.labels)) {
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
