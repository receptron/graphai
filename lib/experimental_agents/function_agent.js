"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionAgent = void 0;
const functionAgent = async ({ inputs, params }) => {
    return params.function(...inputs);
};
exports.functionAgent = functionAgent;
const carInfo = { model: "Model 3", maker: "Tesla", range: 300, price: 35000 };
const functionAgentInfo = {
    name: "functionAgent",
    agent: exports.functionAgent,
    mock: exports.functionAgent,
    samples: [
        {
            inputs: [carInfo],
            params: {
                function: (info) => {
                    const { model, maker, range, price } = info;
                    return `A ${maker} ${model} has the range of ${range} miles. It costs $${price}.`;
                },
            },
            result: "A Tesla Model 3 has the range of 300 miles. It costs $35000.",
        },
        {
            inputs: [JSON.stringify(carInfo)],
            params: {
                function: (str) => {
                    return JSON.parse(str);
                },
            },
            result: carInfo,
        },
    ],
    description: "It allows developers to implement the agent function within the graph itself.",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = functionAgentInfo;
