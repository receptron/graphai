"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyFilterAgent = void 0;
const applyFilter = (input, include, exclude, alter) => {
    const propIds = include ? include : Object.keys(input);
    const excludeSet = new Set(exclude ?? []);
    return propIds.reduce((tmp, propId) => {
        if (!excludeSet.has(propId)) {
            const mapping = alter && alter[propId];
            if (mapping && mapping[input[propId]]) {
                tmp[propId] = mapping[input[propId]];
            }
            else {
                tmp[propId] = input[propId];
            }
        }
        return tmp;
    }, {});
};
const propertyFilterAgent = async ({ inputs, params, }) => {
    const [input] = inputs;
    const { include, exclude, alter } = params;
    if (Array.isArray(input)) {
        return input.map((item) => applyFilter(item, include, exclude, alter));
    }
    return applyFilter(input, include, exclude, alter);
};
exports.propertyFilterAgent = propertyFilterAgent;
const inputs = [
    [
        { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
        { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
    ],
];
const propertyFilterAgentInfo = {
    name: "propertyFilterAgent",
    agent: exports.propertyFilterAgent,
    mock: exports.propertyFilterAgent,
    samples: [
        {
            inputs,
            params: { include: ["color", "model"] },
            result: [
                { color: "red", model: "Model 3" },
                { color: "blue", model: "Model Y" },
            ],
        },
        {
            inputs,
            params: { exclude: ["color", "model"] },
            result: [
                { type: "EV", maker: "Tesla", range: 300 },
                { type: "EV", maker: "Tesla", range: 400 },
            ],
        },
        {
            inputs,
            params: { alter: { color: { red: "blue", blue: "red" } } },
            result: [
                { color: "blue", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
                { color: "red", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
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
