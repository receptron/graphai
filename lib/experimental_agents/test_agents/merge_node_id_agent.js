"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeNodeIdAgent = void 0;
const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, inputs }) => {
    // console.log("executing", nodeId);
    return inputs.reduce((tmp, input) => {
        return { ...tmp, ...input };
    }, { [nodeId]: "hello" });
};
exports.mergeNodeIdAgent = mergeNodeIdAgent;
