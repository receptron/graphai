"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaticNodeData = exports.isComputedNodeData = exports.isNamedInputs = exports.defaultTestContext = exports.isLogicallyTrue = exports.debugResultKey = exports.agentInfoWrapper = exports.defaultAgentInfo = exports.strIntentionalError = exports.isNull = exports.isObject = exports.parseNodeName = exports.sleep = void 0;
exports.assert = assert;
const type_1 = require("../type");
const sleep = async (milliseconds) => {
    return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};
exports.sleep = sleep;
const parseNodeName = (inputNodeId, isSelfNode = false) => {
    if (isSelfNode) {
        if (typeof inputNodeId === "string" && inputNodeId[0] === ".") {
            const parts = inputNodeId.split(".");
            return { nodeId: "self", propIds: parts.slice(1) };
        }
        return { value: inputNodeId };
    }
    if (typeof inputNodeId === "string") {
        const regex = /^:(.*)$/;
        const match = inputNodeId.match(regex);
        if (!match) {
            return { value: inputNodeId }; // string literal
        }
        const parts = match[1].split(".");
        if (parts.length == 1) {
            return { nodeId: parts[0] };
        }
        return { nodeId: parts[0], propIds: parts.slice(1) };
    }
    return { value: inputNodeId }; // non-string literal
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
const isObject = (x) => {
    return x !== null && typeof x === "object";
};
exports.isObject = isObject;
const isNull = (data) => {
    return data === null || data === undefined;
};
exports.isNull = isNull;
exports.strIntentionalError = "Intentional Error for Debugging";
exports.defaultAgentInfo = {
    name: "defaultAgentInfo",
    samples: [
        {
            inputs: [],
            params: {},
            result: {},
        },
    ],
    description: "",
    category: [],
    author: "",
    repository: "",
    license: "",
};
const agentInfoWrapper = (agent) => {
    return {
        agent,
        mock: agent,
        ...exports.defaultAgentInfo,
    };
};
exports.agentInfoWrapper = agentInfoWrapper;
const objectToKeyArray = (innerData) => {
    const ret = [];
    Object.keys(innerData).forEach((key) => {
        ret.push([key]);
        if (Object.keys(innerData[key]).length > 0) {
            objectToKeyArray(innerData[key]).forEach((tmp) => {
                ret.push([key, ...tmp]);
            });
        }
    });
    return ret;
};
const debugResultKey = (agentId, result) => {
    return objectToKeyArray({ [agentId]: debugResultKeyInner(result) }).map((objectKeys) => {
        return ":" + objectKeys.join(".");
    });
};
exports.debugResultKey = debugResultKey;
const debugResultKeyInner = (result) => {
    if (result === null || result === undefined) {
        return {};
    }
    if (typeof result === "string") {
        return {};
    }
    if (Array.isArray(result)) {
        return Array.from(result.keys()).reduce((tmp, index) => {
            tmp["$" + String(index)] = debugResultKeyInner(result[index]);
            return tmp;
        }, {});
    }
    return Object.keys(result).reduce((tmp, key) => {
        tmp[key] = debugResultKeyInner(result[key]);
        return tmp;
    }, {});
};
const isLogicallyTrue = (value) => {
    // Notice that empty aray is not true under GraphAI
    if (Array.isArray(value) ? value.length === 0 : !value) {
        return false;
    }
    return true;
};
exports.isLogicallyTrue = isLogicallyTrue;
exports.defaultTestContext = {
    debugInfo: {
        nodeId: "test",
        retry: 0,
        verbose: true,
        state: type_1.NodeState.Executing,
        subGraphs: new Map(),
    },
    params: {},
    filterParams: {},
    agents: {},
    log: [],
};
const isNamedInputs = (namedInputs) => {
    return (0, exports.isObject)(namedInputs) && !Array.isArray(namedInputs) && Object.keys(namedInputs || {}).length > 0;
};
exports.isNamedInputs = isNamedInputs;
const isComputedNodeData = (node) => {
    return "agent" in node;
};
exports.isComputedNodeData = isComputedNodeData;
const isStaticNodeData = (node) => {
    return !("agent" in node);
};
exports.isStaticNodeData = isStaticNodeData;
