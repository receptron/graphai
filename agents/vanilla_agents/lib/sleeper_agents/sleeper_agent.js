"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleeperAgent = void 0;
const graphai_1 = require("graphai");
const sleeperAgent = async ({ params, namedInputs }) => {
    await (0, graphai_1.sleep)(params?.duration ?? 10);
    return namedInputs;
};
exports.sleeperAgent = sleeperAgent;
const sleeperAgentInfo = {
    name: "sleeperAgent",
    agent: exports.sleeperAgent,
    mock: exports.sleeperAgent,
    samples: [
        {
            inputs: {},
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: { array: [{ a: 1 }, { b: 2 }] },
            params: { duration: 1 },
            result: {
                array: [{ a: 1 }, { b: 2 }],
            },
        },
    ],
    description: "sleeper Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = sleeperAgentInfo;
