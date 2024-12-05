"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bypassAgent = void 0;
// import { isNamedInputs } from "@graphai/agent_utils";
const bypassAgent = async ({ params, namedInputs }) => {
    console.warn(`bypassAgent have been deprecated. replace bypassAgent to copyAgent`);
    const { namedKey } = params;
    if (namedKey) {
        return namedInputs[namedKey];
    }
    return namedInputs;
};
exports.bypassAgent = bypassAgent;
// for test and document
const bypassAgentInfo = {
    name: "bypassAgent",
    agent: exports.bypassAgent,
    mock: exports.bypassAgent,
    samples: [
        {
            inputs: { a: "123" },
            params: {},
            result: { a: "123" },
        },
        {
            inputs: {
                array: [
                    [{ a: "123" }, { b: "abc" }],
                    [{ c: "987" }, { d: "xyz" }],
                ],
            },
            params: {},
            result: {
                array: [
                    [{ a: "123" }, { b: "abc" }],
                    [{ c: "987" }, { d: "xyz" }],
                ],
            },
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
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = bypassAgentInfo;
