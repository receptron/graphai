"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedInputs2dataSources = exports.inputs2dataSources = void 0;
const utils_1 = require("./utils");
const inputs2dataSources = (inputs, graphVersion) => {
    return inputs.reduce((tmp, input) => {
        tmp[input] = (0, utils_1.parseNodeName)(input, graphVersion);
        return tmp;
    }, {});
};
exports.inputs2dataSources = inputs2dataSources;
const namedInputs2dataSources = (inputs, graphVersion) => {
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        if (Array.isArray(input)) {
            tmp[key] = input.map((inp) => (0, utils_1.parseNodeName)(inp, graphVersion));
        }
        else {
            tmp[key] = (0, utils_1.parseNodeName)(input, graphVersion);
        }
        return tmp;
    }, {});
};
exports.namedInputs2dataSources = namedInputs2dataSources;
