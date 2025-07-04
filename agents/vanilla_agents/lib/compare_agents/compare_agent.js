"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareAgent = void 0;
const compare = (_array) => {
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
// TODO: move to agent_utils
const isNull = (data) => {
    return data === null || data === undefined;
};
const compareAgent = async ({ namedInputs, params }) => {
    const { array: _array, leftValue, rightValue } = namedInputs;
    const array = _array ?? [];
    const inputs = (() => {
        if (array.length === 2 && params.operator) {
            return [array[0], params.operator, array[1]];
        }
        if (array.length === 3) {
            return array;
        }
        if (array.length === 0 && !isNull(leftValue) && !isNull(rightValue) && params.operator) {
            return [leftValue, params.operator, rightValue];
        }
        throw new Error(`compare inputs is wrong.`);
    })();
    const ret = compare(inputs);
    if (params?.value) {
        return {
            result: params?.value[ret ? "true" : "false"] ?? ret,
        };
    }
    return {
        result: ret,
    };
};
exports.compareAgent = compareAgent;
const compareAgentInfo = {
    name: "compareAgent",
    agent: exports.compareAgent,
    mock: exports.compareAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "A 3-element array in the form [leftOperand, operator, rightOperand]. Used for direct comparison logic.",
                items: {
                    type: ["string", "number", "boolean", "array"],
                },
            },
            leftValue: {
                type: ["string", "number", "boolean"],
                description: "Left-hand operand used when 'array' is not provided. Used with 'rightValue' and 'params.operator'.",
            },
            rightValue: {
                type: ["string", "number", "boolean"],
                description: "Right-hand operand used when 'array' is not provided. Used with 'leftValue' and 'params.operator'.",
            },
        },
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            operator: {
                type: "string",
                description: "The comparison operator to apply, such as '==', '!=', '>', '>=', '<', '<=', '||', '&&', or 'XOR'. Required if 'array' does not include the operator.",
            },
            value: {
                type: "object",
                description: "An optional mapping for the comparison result. If provided, it must contain keys 'true' and/or 'false' to return custom values instead of booleans.",
                properties: {
                    true: {
                        type: ["string", "number", "boolean"],
                        description: "Custom result to return when the comparison evaluates to true.",
                    },
                    false: {
                        type: ["string", "number", "boolean"],
                        description: "Custom result to return when the comparison evaluates to false.",
                    },
                },
                additionalProperties: false,
            },
        },
        additionalProperties: false,
    },
    output: {},
    samples: [
        {
            inputs: { array: ["abc", "==", "abc"] },
            params: { value: { true: "a", false: "b" } },
            result: {
                result: "a",
            },
        },
        {
            inputs: { array: ["abc", "==", "abca"] },
            params: { value: { true: "a", false: "b" } },
            result: {
                result: "b",
            },
        },
        {
            inputs: { array: ["abc", "==", "abc"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["abc", "==", "abcd"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "!=", "abc"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "!=", "abcd"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", ">", "5"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", ">", "15"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, ">", 5] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, ">", 15] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", ">=", "5"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", ">=", "10"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            // 10
            inputs: { array: ["10", ">=", "19"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, ">=", 5] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, ">=", 10] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, ">=", 19] },
            params: {},
            result: {
                result: false,
            },
        },
        //
        {
            inputs: { array: ["10", "<", "5"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "<", "15"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, "<", 5] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, "<", 15] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "<=", "5"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "<=", "10"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            // 20
            inputs: { array: ["10", "<=", "19"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, "<=", 5] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, "<=", 10] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, "<=", 19] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, "||", false] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, "||", false] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, "&&", false] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, "&&", true] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, "XOR", false] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, "XOR", true] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, "XOR", false] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, "XOR", true] },
            params: {},
            result: {
                result: false,
            },
        },
        //
        {
            inputs: { array: [["aaa", "==", "aaa"], "||", ["aaa", "==", "bbb"]] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [["aaa", "==", "aaa"], "&&", ["aaa", "==", "bbb"]] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [[["aaa", "==", "aaa"], "&&", ["bbb", "==", "bbb"]], "||", ["aaa", "&&", "bbb"]] },
            params: {},
            result: {
                result: true,
            },
        },
        /// params.operator
        {
            inputs: { array: ["abc", "abc"] },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "a",
            },
        },
        {
            inputs: { array: ["abc", "abca"] },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "b",
            },
        },
        {
            inputs: { array: ["abc", "abc"] },
            params: { operator: "==" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["abc", "abcd"] },
            params: { operator: "==" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "abc"] },
            params: { operator: "!=" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "abcd"] },
            params: { operator: "!=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "5"] },
            params: { operator: ">" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "15"] },
            params: { operator: ">" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, 5] },
            params: { operator: ">" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 15] },
            params: { operator: ">" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "5"] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "10"] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "19"] },
            params: { operator: ">=" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, 5] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 10] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 19] },
            params: { operator: ">=" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "5"] },
            params: { operator: "<" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "15"] },
            params: { operator: "<" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 5] },
            params: { operator: "<" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, 15] },
            params: { operator: "<" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, false] },
            params: { operator: "||" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, false] },
            params: { operator: "||" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, false] },
            params: { operator: "&&" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, true] },
            params: { operator: "&&" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, false] },
            params: { operator: "XOR" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, true] },
            params: { operator: "XOR" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, false] },
            params: { operator: "XOR" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, true] },
            params: { operator: "XOR" },
            result: {
                result: false,
            },
        },
        /// left and right
        {
            inputs: { leftValue: "abc", rightValue: "abc" },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "a",
            },
        },
        {
            inputs: { leftValue: "abc", rightValue: "abca" },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "b",
            },
        },
    ],
    description: "compare",
    category: ["compare"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/compare_agents/compare_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = compareAgentInfo;
