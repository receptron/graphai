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
// for anyInput
const cleanResultInner = (results) => {
    if (Array.isArray(results)) {
        return results.map((result) => (0, exports.cleanResultInner)(result)).filter((result) => !(0, utils_1.isNull)(result));
        // return ret.length === 0 ? null : ret;
    }
    if ((0, utils_1.isObject)(results)) {
        return Object.keys(results).reduce((tmp, key) => {
            const value = (0, exports.cleanResultInner)(results[key]);
            if (!(0, utils_1.isNull)(value)) {
                tmp[key] = value;
            }
            return tmp;
        }, {});
        // return Object.keys(ret).length === 0 ? null : ret;
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
