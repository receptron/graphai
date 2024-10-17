"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bypassAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const bypassAgent = async ({ params, inputs, namedInputs }) => {
    const { flat, firstElement, namedKey } = params;
    if ((0, agent_utils_1.isNamedInputs)(namedInputs)) {
        if (namedKey) {
            return namedInputs[namedKey];
        }
        return namedInputs;
    }
    if (params && firstElement) {
        return inputs[0];
    }
    if (params && flat) {
        return inputs.flat(flat || 1);
    }
    return inputs;
};
exports.bypassAgent = bypassAgent;
// for test and document
const bypassAgentInfo = {
    name: "bypassAgent",
    agent: exports.bypassAgent,
    mock: exports.bypassAgent,
    samples: [
        {
            inputs: [{ a: "123" }],
            params: {},
            result: [{ a: "123" }],
        },
        {
            inputs: [
                [{ a: "123" }, { b: "abc" }],
                [{ c: "987" }, { d: "xyz" }],
            ],
            params: {},
            result: [
                [{ a: "123" }, { b: "abc" }],
                [{ c: "987" }, { d: "xyz" }],
            ],
        },
        {
            inputs: [
                [{ a: "123" }, { b: "abc" }],
                [{ c: "987" }, { d: "xyz" }],
            ],
            params: { firstElement: true },
            result: [{ a: "123" }, { b: "abc" }],
        },
        {
            inputs: [
                [{ a: "123" }, { b: "abc" }],
                [{ c: "987" }, { d: "xyz" }],
            ],
            params: { flat: 1 },
            result: [{ a: "123" }, { b: "abc" }, { c: "987" }, { d: "xyz" }],
        },
        // named
        {
            inputs: { a: "123", b: "abc", c: "987", d: "xyz" },
            params: {},
            result: { a: "123", b: "abc", c: "987", d: "xyz" },
        },
    ],
    description: "bypass agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = bypassAgentInfo;
