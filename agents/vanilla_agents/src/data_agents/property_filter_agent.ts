import { AgentFunction, AgentFunctionInfo } from "graphai";

const applyFilter = (
  object: any,
  index: number,
  arrayInputs: any,
  include: Array<string> | undefined,
  exclude: Array<string> | undefined,
  alter: Record<string, Record<string, string>> | undefined,
  inject: Array<Record<string, any>> | undefined,
  swap: Record<string, string> | undefined,
  inspect: Array<Record<string, any>> | undefined,
) => {
  const propIds = include ? include : Object.keys(object);
  const excludeSet = new Set(exclude ?? []);
  const result = propIds.reduce((tmp: Record<string, any>, propId) => {
    if (!excludeSet.has(propId)) {
      const mapping = alter && alter[propId];
      if (mapping && mapping[object[propId]]) {
        tmp[propId] = mapping[object[propId]];
      } else {
        tmp[propId] = object[propId];
      }
    }
    return tmp;
  }, {});

  if (inject) {
    inject.forEach((item) => {
      if (item.index === undefined || item.index === index) {
        result[item.propId] = arrayInputs[item.from];
      }
    });
  }
  if (inspect) {
    inspect.forEach((item) => {
      const value = arrayInputs[item.from ?? 1]; // default is arrayInputs[1]
      if (item.equal) {
        result[item.propId] = item.equal === value;
      } else if (item.notEqual) {
        result[item.propId] = item.notEqual !== value;
      }
    });
  }
  if (swap) {
    Object.keys(swap).forEach((key) => {
      const tmp = result[key];
      result[key] = result[swap[key]];
      result[swap[key]] = tmp;
    });
  }
  return result;
};

export const propertyFilterAgent: AgentFunction<{
  include?: Array<string>;
  exclude?: Array<string>;
  alter?: Record<string, Record<string, string>>;
  inject?: Array<Record<string, any>>;
  inspect?: Array<Record<string, any>>;
  swap?: Record<string, string>;
}> = async ({ namedInputs, params }) => {
  const { include, exclude, alter, inject, swap, inspect } = params;
  const { _array, array } = namedInputs;
  const arrayInputs = _array || array;
  if (arrayInputs) {
    if (array) {
      console.log("WARNING: propertyFilter, array is obsolete. Use _array")
    }
    // This is advanced usage, including "inject" and "inspect", which uses
    // array[1], array[2], ...
    const [target] = arrayInputs; // Extract the first one
    if (Array.isArray(target)) {
      return target.map((item, index) => applyFilter(item, index, arrayInputs, include, exclude, alter, inject, swap, inspect));
    }
    return applyFilter(target, 0, arrayInputs, include, exclude, alter, inject, swap, inspect);
  }
  // This is simple case. No "inject" or "inspect"
  return applyFilter(namedInputs, 0, [], include, exclude, alter, inject, swap, inspect);
};

const testInputs = {
  _array: [
    [
      { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
      { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
    ],
    "Tesla Motors",
  ],
};

const propertyFilterAgentInfo: AgentFunctionInfo = {
  name: "propertyFilterAgent",
  agent: propertyFilterAgent,
  mock: propertyFilterAgent,
  inputs: {
    type: "object",
  },
  output: {
    type: "any",
  },
  samples: [
    {
      inputs: { _array: [testInputs._array[0][0]] },
      params: { include: ["color", "model"] },
      result: { color: "red", model: "Model 3" },
    },
    {
      inputs: testInputs._array[0][0],
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
      inputs: testInputs._array[0][0],
      params: { exclude: ["color", "model"] },
      result: { type: "EV", maker: "Tesla", range: 300 },
    },
    {
      inputs: testInputs,
      params: { alter: { color: { red: "blue", blue: "red" } } },
      result: [
        {
          color: "blue",
          model: "Model 3",
          type: "EV",
          maker: "Tesla",
          range: 300,
        },
        {
          color: "red",
          model: "Model Y",
          type: "EV",
          maker: "Tesla",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs._array[0][0],
      params: { alter: { color: { red: "blue", blue: "red" } } },
      result: {
        color: "blue",
        model: "Model 3",
        type: "EV",
        maker: "Tesla",
        range: 300,
      },
    },
    {
      inputs: testInputs,
      params: { swap: { maker: "model" } },
      result: [
        {
          color: "red",
          model: "Tesla",
          type: "EV",
          maker: "Model 3",
          range: 300,
        },
        {
          color: "blue",
          model: "Tesla",
          type: "EV",
          maker: "Model Y",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs._array[0][0],
      params: { swap: { maker: "model" } },
      result: {
        color: "red",
        model: "Tesla",
        type: "EV",
        maker: "Model 3",
        range: 300,
      },
    },
    {
      inputs: testInputs,
      params: { inject: [{ propId: "maker", from: 1 }] },
      result: [
        {
          color: "red",
          model: "Model 3",
          type: "EV",
          maker: "Tesla Motors",
          range: 300,
        },
        {
          color: "blue",
          model: "Model Y",
          type: "EV",
          maker: "Tesla Motors",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs,
      params: { inject: [{ propId: "maker", from: 1, index: 0 }] },
      result: [
        {
          color: "red",
          model: "Model 3",
          type: "EV",
          maker: "Tesla Motors",
          range: 300,
        },
        {
          color: "blue",
          model: "Model Y",
          type: "EV",
          maker: "Tesla",
          range: 400,
        },
      ],
    },
    {
      inputs: testInputs,
      params: {
        inspect: [
          { propId: "isTesla", equal: "Tesla Motors" }, // from: 1 is implied
          { propId: "isGM", notEqual: "Tesla Motors", from: 1 },
        ],
      },
      result: [
        {
          color: "red",
          model: "Model 3",
          type: "EV",
          maker: "Tesla",
          range: 300,
          isTesla: true,
          isGM: false,
        },
        {
          color: "blue",
          model: "Model Y",
          type: "EV",
          maker: "Tesla",
          range: 400,
          isTesla: true,
          isGM: false,
        },
      ],
    },
  ],
  description: "Filter properties based on property name either with 'include' or 'exclude'",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default propertyFilterAgentInfo;
