"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromSource = void 0;
const utils_1 = require("./utils");
const prop_function_1 = require("./prop_function");
const getNestedData = (result, propId) => {
    const match = propId.match(prop_function_1.propFunctionRegex);
    if (match) {
        return (0, prop_function_1.propFunction)(result, propId);
    }
    // for array.
    if (Array.isArray(result)) {
        // $0, $1. array value.
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
    else if ((0, utils_1.isObject)(result)) {
        if (propId in result) {
            return result[propId];
        }
    }
    return undefined;
};
const innerGetDataFromSource = (result, propIds) => {
    if (!(0, utils_1.isNull)(result) && propIds && propIds.length > 0) {
        const propId = propIds[0];
        const ret = getNestedData(result, propId);
        if (ret === undefined) {
            console.error(`prop: ${propIds.join(".")} is not hit`);
        }
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
