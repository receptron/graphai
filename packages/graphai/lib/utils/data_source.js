"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromSource = void 0;
const utils_1 = require("./utils");
const prop_function_1 = require("./prop_function");
const GraphAILogger_1 = require("./GraphAILogger");
const getNestedData = (result, propId, propFunctions) => {
    const match = propId.match(prop_function_1.propFunctionRegex);
    if (match) {
        for (const propFunction of propFunctions) {
            const ret = propFunction(result, propId);
            if (!(0, utils_1.isNull)(ret)) {
                return ret;
            }
        }
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
const innerGetDataFromSource = (result, propIds, propFunctions) => {
    if (propIds && propIds.length > 0) {
        const propId = propIds[0];
        const ret = getNestedData(result, propId, propFunctions);
        if (ret === undefined) {
            GraphAILogger_1.GraphAILogger.debug(`prop: ${propIds.join(".")} is not hit`);
        }
        if (propIds.length > 1) {
            return innerGetDataFromSource(ret, propIds.slice(1), propFunctions);
        }
        return ret;
    }
    return result;
};
const getDataFromSource = (result, source, propFunctions = []) => {
    if (!source.nodeId) {
        return source.value;
    }
    return innerGetDataFromSource(result, source.propIds, propFunctions);
};
exports.getDataFromSource = getDataFromSource;
