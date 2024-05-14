"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyFilterAgent = void 0;
const applyFilter = (input, index, inputs, include, exclude, alter, inject, swap) => {
    const propIds = include ? include : Object.keys(input);
    const excludeSet = new Set(exclude ?? []);
    const result = propIds.reduce((tmp, propId) => {
        if (!excludeSet.has(propId)) {
            const injection = inject && inject[propId];
            const mapping = alter && alter[propId];
            if (injection && (injection.index === undefined || injection.index === index)) {
                tmp[propId] = inputs[injection.from];
            }
            else if (mapping && mapping[input[propId]]) {
                tmp[propId] = mapping[input[propId]];
            }
            else {
                tmp[propId] = input[propId];
            }
        }
        return tmp;
    }, {});
    if (swap) {
        Object.keys(swap).forEach((key) => {
            const tmp = result[key];
            result[key] = result[swap[key]];
            result[swap[key]] = tmp;
        });
    }
    return result;
};
const propertyFilterAgent = async ({ inputs, params }) => {
    const [input] = inputs;
    const { include, exclude, alter, inject, swap } = params;
    if (Array.isArray(input)) {
        return input.map((item, index) => applyFilter(item, index, inputs, include, exclude, alter, inject, swap));
    }
    return applyFilter(input, 0, inputs, include, exclude, alter, inject, swap);
};
exports.propertyFilterAgent = propertyFilterAgent;
const testInputs = [
    [
        { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
        { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
    ],
    "Tesla Motors",
];
const propertyFilterAgentInfo = {
    name: "propertyFilterAgent",
    agent: exports.propertyFilterAgent,
    mock: exports.propertyFilterAgent,
    samples: [
        {
            inputs: [testInputs[0][0]],
            params: { include: ["color", "model"] },
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: testInputs,
            params: { include: ["color", "model"] },
            result: [
                { color: "red", model: "Model 3" },
                { color: "blue", model: "Model Y" },
            ],
        },
        {
            inputs: testInputs,
            params: { exclude: ["color", "model"] },
            result: [
                { type: "EV", maker: "Tesla", range: 300 },
                { type: "EV", maker: "Tesla", range: 400 },
            ],
        },
        {
            inputs: testInputs,
            params: { alter: { color: { red: "blue", blue: "red" } } },
            result: [
                { color: "blue", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
                { color: "red", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
            ],
        },
        {
            inputs: testInputs,
            params: { inject: { maker: { from: 1 } } },
            result: [
                { color: "red", model: "Model 3", type: "EV", maker: "Tesla Motors", range: 300 },
                { color: "blue", model: "Model Y", type: "EV", maker: "Tesla Motors", range: 400 },
            ],
        },
        {
            inputs: testInputs,
            params: { inject: { maker: { index: 0, from: 1 } } },
            result: [
                { color: "red", model: "Model 3", type: "EV", maker: "Tesla Motors", range: 300 },
                { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
            ],
        },
        {
            inputs: testInputs,
            params: { swap: { maker: "model" } },
            result: [
                { color: "red", model: "Tesla", type: "EV", maker: "Model 3", range: 300 },
                { color: "blue", model: "Tesla", type: "EV", maker: "Model Y", range: 400 },
            ],
        },
    ],
    description: "Filter properties based on property name either with 'include' or 'exclude'",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = propertyFilterAgentInfo;
