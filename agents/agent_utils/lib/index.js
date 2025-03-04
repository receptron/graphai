"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNull = exports.arrayValidate = exports.isNamedInputs = exports.sample2GraphData = void 0;
const graphai_1 = require("graphai");
__exportStar(require("./type"), exports);
const sample2GraphData = (sample, agentName) => {
    const nodes = {};
    const inputs = (() => {
        if (Array.isArray(sample.inputs)) {
            Array.from(sample.inputs.keys()).forEach((key) => {
                nodes["sampleInput" + key] = {
                    value: sample.inputs[key],
                };
            });
            return Object.keys(nodes).map((k) => ":" + k);
        }
        nodes["sampleInput"] = {
            value: sample.inputs,
        };
        return Object.keys(sample.inputs).reduce((tmp, key) => {
            tmp[key] = `:sampleInput.` + key;
            return tmp;
        }, {});
    })();
    nodes["node"] = {
        isResult: true,
        agent: agentName,
        params: sample.params,
        inputs: inputs,
        graph: sample.graph,
    };
    const graphData = {
        version: 0.5,
        nodes,
    };
    return graphData;
};
exports.sample2GraphData = sample2GraphData;
const isNamedInputs = (namedInputs) => {
    return Object.keys(namedInputs || {}).length > 0;
};
exports.isNamedInputs = isNamedInputs;
const arrayValidate = (agentName, namedInputs, extra_message = "") => {
    (0, graphai_1.assert)((0, exports.isNamedInputs)(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
    (0, graphai_1.assert)(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
    (0, graphai_1.assert)(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
};
exports.arrayValidate = arrayValidate;
const isNull = (data) => {
    return data === null || data === undefined;
};
exports.isNull = isNull;
