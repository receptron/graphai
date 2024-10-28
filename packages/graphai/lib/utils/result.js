"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanResult = exports.cleanResultInner = exports.resultOf = exports.resultsOf = void 0;
const utils_1 = require("../utils/utils");
const data_source_1 = require("../utils/data_source");
const resultsOfInner = (input, nodes) => {
    if (Array.isArray(input)) {
        return input.map((inp) => resultsOfInner(inp, nodes));
    }
    if ((0, utils_1.isNamedInputs)(input)) {
        return (0, exports.resultsOf)(input, nodes);
    }
    if (typeof input === "string") {
        const templateMatch = [...input.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            const results = resultsOfInner(templateMatch, nodes);
            return Array.from(templateMatch.keys()).reduce((tmp, key) => {
                return tmp.replaceAll("${" + templateMatch[key] + "}", results[key]);
            }, input);
        }
    }
    return (0, exports.resultOf)((0, utils_1.parseNodeName)(input), nodes);
};
const resultsOf = (inputs, nodes) => {
    // for inputs. TODO remove if array input is not supported
    if (Array.isArray(inputs)) {
        return inputs.reduce((tmp, key) => {
            tmp[key] = resultsOfInner(key, nodes);
            return tmp;
        }, {});
    }
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        tmp[key] = (0, utils_1.isNamedInputs)(input) ? (0, exports.resultsOf)(input, nodes) : resultsOfInner(input, nodes);
        return tmp;
    }, {});
};
exports.resultsOf = resultsOf;
const resultOf = (source, nodes) => {
    const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
    return (0, data_source_1.getDataFromSource)(result, source);
};
exports.resultOf = resultOf;
// clean up object for anyInput
const cleanResultInner = (results) => {
    if (Array.isArray(results)) {
        return results.map((result) => (0, exports.cleanResultInner)(result)).filter((result) => !(0, utils_1.isNull)(result));
    }
    if ((0, utils_1.isObject)(results)) {
        return Object.keys(results).reduce((tmp, key) => {
            const value = (0, exports.cleanResultInner)(results[key]);
            if (!(0, utils_1.isNull)(value)) {
                tmp[key] = value;
            }
            return tmp;
        }, {});
    }
    return results;
};
exports.cleanResultInner = cleanResultInner;
const cleanResult = (results) => {
    return Object.keys(results).reduce((tmp, key) => {
        const value = (0, exports.cleanResultInner)(results[key]);
        if (!(0, utils_1.isNull)(value)) {
            tmp[key] = value;
        }
        return tmp;
    }, {});
};
exports.cleanResult = cleanResult;
