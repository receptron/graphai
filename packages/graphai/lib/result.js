"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanResult = exports.cleanResultInner = exports.resultOf = exports.resultsOf = void 0;
const type_1 = require("./type");
const utils_1 = require("./utils/utils");
const nestedResultOf = (source, nodes) => {
    if (Array.isArray(source)) {
        return source.map((a) => {
            return nestedResultOf(a, nodes);
        });
    }
    if ((0, utils_1.isNamedInputs)(source)) {
        if (source.__type === type_1.DataSourceType) {
            return (0, exports.resultOf)(source, nodes);
        }
        return Object.keys(source).reduce((tmp, key) => {
            tmp[key] = nestedResultOf(source[key], nodes);
            return tmp;
        }, {});
    }
    return (0, exports.resultOf)(source, nodes);
};
const resultsOf = (sources, nodes) => {
    const ret = {};
    Object.keys(sources).forEach((key) => {
        ret[key] = nestedResultOf(sources[key], nodes);
    });
    return ret;
};
exports.resultsOf = resultsOf;
const resultOf = (source, nodes) => {
    const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
    return (0, utils_1.getDataFromSource)(result, source);
};
exports.resultOf = resultOf;
const cleanResultInner = (results) => {
    if (Array.isArray(results)) {
        return results.filter((result) => result).map((result) => (0, exports.cleanResultInner)(result));
    }
    if ((0, utils_1.isObject)(results)) {
        return Object.keys(results).reduce((tmp, key) => {
            if (results[key]) {
                tmp[key] = (0, exports.cleanResultInner)(results[key]);
            }
            return tmp;
        }, {});
    }
    return results;
};
exports.cleanResultInner = cleanResultInner;
const cleanResult = (results) => {
    return Object.keys(results).reduce((tmp, key) => {
        if (results[key]) {
            tmp[key] = (0, exports.cleanResultInner)(results[key]);
        }
        return tmp;
    }, {});
};
exports.cleanResult = cleanResult;
