"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strIntentionalError = exports.getDataFromSource = exports.isObject = exports.assert = exports.parseNodeName = exports.sleep = void 0;
const sleep = async (milliseconds) => {
    return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};
exports.sleep = sleep;
const parseNodeName = (inputNodeId) => {
    const parts = inputNodeId.split(".");
    if (parts.length == 1) {
        return { nodeId: parts[0] };
    }
    return { nodeId: parts[0], propIds: parts.slice(1) };
};
exports.parseNodeName = parseNodeName;
function assert(condition, message, isWarn = false) {
    if (!condition) {
        if (!isWarn) {
            throw new Error(message);
        }
        console.warn("warn: " + message);
    }
}
exports.assert = assert;
const isObject = (x) => {
    return x !== null && typeof x === "object";
};
exports.isObject = isObject;
const getNestedData = (result, propId) => {
    if (Array.isArray(result)) {
        const regex = /^\$(\d+)$/;
        const match = propId.match(regex);
        if (match) {
            const index = parseInt(match[1], 10);
            return result[index];
        }
        if (propId === "$last") {
            return result[result.length - 1];
        }
    }
    assert((0, exports.isObject)(result), "result is not object.");
    return result[propId];
};
const getDataFromSource = (result, propIds) => {
    if (result && propIds && propIds.length > 0) {
        const propId = propIds[0];
        const ret = getNestedData(result, propId);
        if (propIds.length > 1) {
            return (0, exports.getDataFromSource)(ret, propIds.slice(1));
        }
        return ret;
    }
    return result;
};
exports.getDataFromSource = getDataFromSource;
exports.strIntentionalError = "Intentional Error for Debugging";
