"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyFilterAgent = void 0;
const propertyFilterAgent = async ({ inputs, params }) => {
    const [input] = inputs;
    const { include, exclude } = params;
    const propIds = include ? include : Object.keys(input);
    const excludeSet = new Set(exclude ?? []);
    return propIds.reduce((tmp, propId) => {
        if (!excludeSet.has(propId)) {
            tmp[propId] = input[propId];
        }
        return tmp;
    }, {});
};
exports.propertyFilterAgent = propertyFilterAgent;
const inputs = [{ color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 }];
const propertyFilterAgentInfo = {
    name: "propertyFilterAgent",
    agent: exports.propertyFilterAgent,
    mock: exports.propertyFilterAgent,
    samples: [
        {
            inputs,
            params: { include: ["color", "model"] },
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs,
            params: { exclude: ["color", "model"] },
            result: { type: "EV", maker: "Tesla", range: 300 },
        },
    ],
    description: "Filter properties based on property name either with 'include' or 'exclude'",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = propertyFilterAgentInfo;
