"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.parseNodeName = exports.sleep = void 0;
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
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.assert = assert;
