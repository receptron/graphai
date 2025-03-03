import { AgentFunction, AgentFunctionInfo } from "graphai";

type CompareDataItem = string | number | boolean | CompareData;
type CompareData = CompareDataItem[];

const compare = (_array: CompareData): boolean => {
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

export const compareAgent: AgentFunction = async ({ namedInputs, params }) => {
  const { array } = namedInputs;
  const inputs = (() => {
    if (array.length === 2 && params.operator) {
      return [array[0], params.operator, array[1]];
    }
    if (array.length === 3) {
      return namedInputs.array;
    }
    throw new Error(`compare inputs is wrong.`);
  })();
  const ret = compare(inputs);
  if (params?.value) {
    return params?.value[ret ? "true" : "false"] ?? ret;
  }
  return ret;
};

const compareAgentInfo: AgentFunctionInfo = {
  name: "compareAgent",
  agent: compareAgent,
  mock: compareAgent,
  inputs: {},
  output: {},
  samples: [
    {
      inputs: { array: ["abc", "==", "abc"] },
      params: { value: { true: "a", false: "b" } },
      result: "a",
    },
    {
      inputs: { array: ["abc", "==", "abca"] },
      params: { value: { true: "a", false: "b" } },
      result: "b",
    },
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

    /// params.operator
    {
      inputs: { array: ["abc", "abc"] },
      params: { value: { true: "a", false: "b" }, operator: "==" },
      result: "a",
    },
    {
      inputs: { array: ["abc", "abca"] },
      params: { value: { true: "a", false: "b" }, operator: "==" },
      result: "b",
    },
    {
      inputs: { array: ["abc", "abc"] },
      params: { operator: "==" },
      result: true,
    },
    {
      inputs: { array: ["abc", "abcd"] },
      params: { operator: "==" },
      result: false,
    },
    {
      inputs: { array: ["abc", "abc"] },
      params: { operator: "!=" },
      result: false,
    },
    {
      inputs: { array: ["abc", "abcd"] },
      params: { operator: "!=" },
      result: true,
    },
    {
      inputs: { array: ["10", "5"] },
      params: { operator: ">" },
      result: true,
    },
    {
      inputs: { array: ["10", "15"] },
      params: { operator: ">" },
      result: false,
    },
    {
      inputs: { array: [10, 5] },
      params: { operator: ">" },
      result: true,
    },
    {
      inputs: { array: [10, 15] },
      params: { operator: ">" },
      result: false,
    },
    {
      inputs: { array: ["10", "5"] },
      params: { operator: ">=" },
      result: true,
    },
    {
      inputs: { array: ["10", "10"] },
      params: { operator: ">=" },
      result: true,
    },
    {
      inputs: { array: ["10", "19"] },
      params: { operator: ">=" },
      result: false,
    },
    {
      inputs: { array: [10, 5] },
      params: { operator: ">=" },
      result: true,
    },
    {
      inputs: { array: [10, 10] },
      params: { operator: ">=" },
      result: true,
    },
    {
      inputs: { array: [10, 19] },
      params: { operator: ">=" },
      result: false,
    },
    {
      inputs: { array: ["10", "5"] },
      params: { operator: "<" },
      result: false,
    },
    {
      inputs: { array: ["10", "15"] },
      params: { operator: "<" },
      result: true,
    },
    {
      inputs: { array: [10, 5] },
      params: { operator: "<" },
      result: false,
    },
    {
      inputs: { array: [10, 15] },
      params: { operator: "<" },
      result: true,
    },
    {
      inputs: { array: [true, false] },
      params: { operator: "||" },
      result: true,
    },
    {
      inputs: { array: [false, false] },
      params: { operator: "||" },
      result: false,
    },
    {
      inputs: { array: [true, false] },
      params: { operator: "&&" },
      result: false,
    },
    {
      inputs: { array: [true, true] },
      params: { operator: "&&" },
      result: true,
    },
    {
      inputs: { array: [true, false] },
      params: { operator: "XOR" },
      result: true,
    },
    {
      inputs: { array: [false, true] },
      params: { operator: "XOR" },
      result: true,
    },
    {
      inputs: { array: [false, false] },
      params: { operator: "XOR" },
      result: false,
    },
    {
      inputs: { array: [true, true] },
      params: { operator: "XOR" },
      result: false,
    },
  ],
  description: "compare",
  category: ["compare"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default compareAgentInfo;
