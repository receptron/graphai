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
    return { nodeId: parts[0], propId: parts[1] };
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
const getDataFromSource = (result, source) => {
    return result && source.propId ? result[source.propId] : result;
};
exports.getDataFromSource = getDataFromSource;
exports.strIntentionalError = "Intentional Error for Debugging";
