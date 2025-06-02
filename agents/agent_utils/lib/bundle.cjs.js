'use strict';

var graphai = require('graphai');

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
const isNamedInputs = (namedInputs) => {
    return Object.keys(namedInputs || {}).length > 0;
};
const arrayValidate = (agentName, namedInputs, extra_message = "") => {
    graphai.assert(isNamedInputs(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
    graphai.assert(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
    graphai.assert(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
};
const isNull = (data) => {
    return data === null || data === undefined;
};

exports.arrayValidate = arrayValidate;
exports.isNamedInputs = isNamedInputs;
exports.isNull = isNull;
exports.sample2GraphData = sample2GraphData;
//# sourceMappingURL=bundle.cjs.js.map
