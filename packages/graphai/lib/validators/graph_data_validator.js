"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphDataValidator = exports.graphNodesValidator = void 0;
const common_1 = require("./common");
const utils_1 = require("../utils/utils");
const concurrencyConfigKeys = ["global", "labels"];
const validateConcurrencyValue = (value, fieldDescription) => {
    if (typeof value !== "number" || !Number.isInteger(value)) {
        throw new common_1.ValidationError(`${fieldDescription} must be an integer`);
    }
    if (value < 1) {
        throw new common_1.ValidationError(`${fieldDescription} must be a positive integer`);
    }
};
const validateConcurrencyConfig = (concurrency) => {
    if (typeof concurrency === "number") {
        validateConcurrencyValue(concurrency, "Concurrency");
        return;
    }
    if (!(0, utils_1.isPlainObject)(concurrency)) {
        throw new common_1.ValidationError("Concurrency must be an integer");
    }
    for (const key of Object.keys(concurrency)) {
        if (!concurrencyConfigKeys.includes(key)) {
            throw new common_1.ValidationError(`Concurrency object does not allow ${key}`);
        }
    }
    if (!("global" in concurrency)) {
        throw new common_1.ValidationError("Concurrency object must have a global field");
    }
    validateConcurrencyValue(concurrency.global, "Concurrency.global");
    // The schema declares labels?: Record<string, number>. undefined is the only
    // sentinel for "absent"; null, arrays, Maps, Dates and other non-plain-object
    // shapes are malformed and would silently disable label enforcement (their
    // Object.entries() yields no string keys).
    if (concurrency.labels !== undefined) {
        if (!(0, utils_1.isPlainObject)(concurrency.labels)) {
            throw new common_1.ValidationError("Concurrency.labels must be an object");
        }
        for (const [labelKey, labelValue] of Object.entries(concurrency.labels)) {
            validateConcurrencyValue(labelValue, `Concurrency.labels.${labelKey}`);
        }
    }
};
const graphNodesValidator = (data) => {
    if (data.nodes === undefined) {
        throw new common_1.ValidationError("Invalid Graph Data: no nodes");
    }
    if (typeof data.nodes !== "object") {
        throw new common_1.ValidationError("Invalid Graph Data: invalid nodes");
    }
    if (Array.isArray(data.nodes)) {
        throw new common_1.ValidationError("Invalid Graph Data: nodes must be object");
    }
    if (Object.keys(data.nodes).length === 0) {
        throw new common_1.ValidationError("Invalid Graph Data: nodes is empty");
    }
    Object.keys(data).forEach((key) => {
        if (!common_1.graphDataAttributeKeys.includes(key)) {
            throw new common_1.ValidationError("Graph Data does not allow " + key);
        }
    });
};
exports.graphNodesValidator = graphNodesValidator;
const graphDataValidator = (data) => {
    if (data.loop) {
        if (data.loop.count === undefined && data.loop.while === undefined) {
            throw new common_1.ValidationError("Loop: Either count or while is required in loop");
        }
        if (data.loop.count !== undefined && data.loop.while !== undefined) {
            throw new common_1.ValidationError("Loop: Both count and while cannot be set");
        }
    }
    if (data.concurrency !== undefined) {
        validateConcurrencyConfig(data.concurrency);
    }
};
exports.graphDataValidator = graphDataValidator;
