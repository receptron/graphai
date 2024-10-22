"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNamedInputs = exports.defaultTestContext = exports.isLogicallyTrue = exports.debugResultKey = exports.agentInfoWrapper = exports.defaultAgentInfo = exports.strIntentionalError = exports.getDataFromSource = exports.isNull = exports.isObject = exports.parseNodeName = exports.sleep = void 0;
exports.assert = assert;
const sleep = async (milliseconds) => {
    return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};
exports.sleep = sleep;
const parseNodeName = (inputNodeId) => {
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
        if (propId === "length()") {
            return result.length;
        }
        if (propId === "flat()") {
            return result.flat();
        }
        const matchJoin = propId.match(/^join\(([,-])\)$/);
        if (matchJoin && Array.isArray(matchJoin)) {
            return result.join(matchJoin[1]);
        }
        // flat, join
    }
    else if ((0, exports.isObject)(result)) {
        if (propId === "keys()") {
            return Object.keys(result);
        }
        if (propId === "values()") {
            return Object.values(result);
        }
        return result[propId];
    }
    else if (typeof result === "string") {
        if (propId === "jsonParse()") {
            return JSON.parse(result);
        }
    }
    return undefined;
};
const innerGetDataFromSource = (result, propIds) => {
    if (result && propIds && propIds.length > 0) {
        const propId = propIds[0];
        const ret = getNestedData(result, propId);
        if (propIds.length > 1) {
            return innerGetDataFromSource(ret, propIds.slice(1));
        }
        return ret;
    }
    return result;
};
const getDataFromSource = (result, source) => {
    if (!source.nodeId) {
        return source.value;
    }
    return innerGetDataFromSource(result, source.propIds);
};
exports.getDataFromSource = getDataFromSource;
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
