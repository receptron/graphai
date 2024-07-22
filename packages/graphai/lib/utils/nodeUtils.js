"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatDataSource = exports.flatDataSourceNodeIds = exports.namedInputs2dataSources = exports.inputs2dataSources = void 0;
const utils_1 = require("./utils");
const inputs2dataSources = (inputs, graphVersion) => {
    return inputs.reduce((tmp, input) => {
        tmp[input] = (0, utils_1.parseNodeName)(input, graphVersion);
        return tmp;
    }, {});
};
exports.inputs2dataSources = inputs2dataSources;
const nestedParseNodeName = (input, graphVersion) => {
    if (Array.isArray(input)) {
        return input.map((inp) => nestedParseNodeName(inp, graphVersion));
    }
    return (0, utils_1.parseNodeName)(input, graphVersion);
};
const namedInputs2dataSources = (inputs, graphVersion) => {
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        tmp[key] = nestedParseNodeName(input, graphVersion);
        return tmp;
    }, {});
};
exports.namedInputs2dataSources = namedInputs2dataSources;
const flatDataSourceNodeIds = (sources) => {
    return (0, exports.flatDataSource)(sources)
        .filter((source) => source.nodeId)
        .map((source) => source.nodeId);
};
exports.flatDataSourceNodeIds = flatDataSourceNodeIds;
const flatDataSource = (sources) => {
    return sources
        .map((source) => {
        if (Array.isArray(source)) {
            return source
                .map((s) => {
                if (Array.isArray(s)) {
                    return (0, exports.flatDataSource)(s);
                }
                return s;
            })
                .flat();
        }
        return source;
    })
        .flat();
};
exports.flatDataSource = flatDataSource;
