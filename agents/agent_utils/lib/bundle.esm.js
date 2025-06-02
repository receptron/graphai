import { assert } from 'graphai';

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
    assert(isNamedInputs(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
    assert(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
    assert(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
};
const isNull = (data) => {
    return data === null || data === undefined;
};

export { arrayValidate, isNamedInputs, isNull, sample2GraphData };
//# sourceMappingURL=bundle.esm.js.map
