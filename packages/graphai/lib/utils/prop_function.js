"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propFunctions = exports.propFunctionRegex = void 0;
const utils_1 = require("./utils");
exports.propFunctionRegex = /^[a-zA-Z]+\([^)]*\)$/;
const propArrayFunction = (result, propId) => {
    if (Array.isArray(result)) {
        if (propId === "length()") {
            return result.length;
        }
        if (propId === "flat()") {
            return result.flat();
        }
        if (propId === "toJSON()") {
            return JSON.stringify(result);
        }
        if (propId === "isEmpty()") {
            return result.length === 0;
        }
        // array join
        const matchJoin = propId.match(/^join\(([,-\s]?)\)$/);
        if (matchJoin && Array.isArray(matchJoin)) {
            return result.join(matchJoin[1] ?? "");
        }
    }
    return undefined;
};
const propObjectFunction = (result, propId) => {
    if ((0, utils_1.isObject)(result)) {
        if (propId === "keys()") {
            return Object.keys(result);
        }
        if (propId === "values()") {
            return Object.values(result);
        }
        if (propId === "toJSON()") {
            return JSON.stringify(result);
        }
    }
    return undefined;
};
const propStringFunction = (result, propId) => {
    if (typeof result === "string") {
        if (propId === "codeBlock()") {
            const match = ("\n" + result).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
            if (match) {
                return match[1];
            }
        }
        if (propId === "jsonParse()") {
            return JSON.parse(result);
        }
        if (propId === "toNumber()") {
            const ret = Number(result);
            if (!isNaN(ret)) {
                return ret;
            }
        }
        if (propId === "trim()") {
            return result.trim();
        }
        if (propId === "toLowerCase()") {
            return result.toLowerCase();
        }
        if (propId === "toUpperCase()") {
            return result.toUpperCase();
        }
        const match = propId.match(/^split\(([-_:;.,\s\n]+)\)$/);
        if (match) {
            return result.split(match[1]);
        }
    }
    return undefined;
};
const propNumberFunction = (result, propId) => {
    if (result !== undefined && Number.isFinite(result)) {
        if (propId === "toString()") {
            return String(result);
        }
        const regex = /^add\((-?\d+)\)$/;
        const match = propId.match(regex);
        if (match) {
            return Number(result) + Number(match[1]);
        }
    }
    return undefined;
};
const propBooleanFunction = (result, propId) => {
    if (typeof result === "boolean") {
        if (propId === "not()") {
            return !result;
        }
    }
    return undefined;
};
exports.propFunctions = [propArrayFunction, propObjectFunction, propStringFunction, propNumberFunction, propBooleanFunction];
