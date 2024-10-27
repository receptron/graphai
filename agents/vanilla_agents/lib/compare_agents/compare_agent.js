"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareAgent = void 0;
const compare = (_array) => {
    if (_array.length !== 3) {
        throw new Error(`compare inputs length must must be 3`);
    }
    const array = _array.map((value) => {
        if (Array.isArray(value)) {
            return compare(value);
        }
        return value;
    });
    const [a, operator, b] = array;
    if (operator === "==") {
        return a === b;
    }
    if (operator === "!=") {
        return a !== b;
    }
    if (operator === ">") {
        return Number(a) > Number(b);
    }
    if (operator === ">=") {
        return Number(a) >= Number(b);
    }
    if (operator === "<") {
        return Number(a) < Number(b);
    }
    if (operator === "<=") {
        return Number(a) <= Number(b);
    }
    if (operator === "||") {
        return !!a || !!b;
    }
    if (operator === "&&") {
        return !!a && !!b;
    }
    if (operator === "XOR") {
        return !!a === !b;
    }
    throw new Error(`unknown compare operator`);
};
const compareAgent = async ({ namedInputs }) => {
    return compare(namedInputs.array);
};
exports.compareAgent = compareAgent;
const compareAgentInfo = {
    name: "compareAgent",
    agent: exports.compareAgent,
    mock: exports.compareAgent,
    inputs: {},
    output: {},
    samples: [
        {
            inputs: { array: ["abc", "==", "abc"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["abc", "==", "abcd"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["abc", "!=", "abc"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["abc", "!=", "abcd"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", ">", "5"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", ">", "15"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, ">", 5] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, ">", 15] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["10", ">=", "5"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", ">=", "10"] },
            params: {},
            result: true,
        },
        {
            // 10
            inputs: { array: ["10", ">=", "19"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, ">=", 5] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, ">=", 10] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, ">=", 19] },
            params: {},
            result: false,
        },
        //
        {
            inputs: { array: ["10", "<", "5"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["10", "<", "15"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, "<", 5] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, "<", 15] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", "<=", "5"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["10", "<=", "10"] },
            params: {},
            result: true,
        },
        {
            // 20
            inputs: { array: ["10", "<=", "19"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, "<=", 5] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, "<=", 10] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, "<=", 19] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [true, "||", false] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [false, "||", false] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [true, "&&", false] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [true, "&&", true] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [true, "XOR", false] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [false, "XOR", true] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [false, "XOR", false] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [true, "XOR", true] },
            params: {},
            result: false,
        },
        //
        {
            inputs: { array: [["aaa", "==", "aaa"], "||", ["aaa", "==", "bbb"]] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [["aaa", "==", "aaa"], "&&", ["aaa", "==", "bbb"]] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [[["aaa", "==", "aaa"], "&&", ["bbb", "==", "bbb"]], "||", ["aaa", "&&", "bbb"]] },
            params: {},
            result: true,
        },
    ],
    description: "compare",
    category: ["compare"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = compareAgentInfo;
