import { DataSource, ResultData, AgentFunction, DefaultInputData, DataSourceType } from "@/type";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const parseNodeName_02 = (inputNodeId: any): DataSource => {
  if (typeof inputNodeId === "string") {
    const regex = /^"(.*)"$/;
    const match = inputNodeId.match(regex);
    if (match) {
      return { value: match[1], type: DataSourceType }; // string literal
    }
    const parts = inputNodeId.split(".");
    if (parts.length == 1) {
      return { nodeId: parts[0], type: DataSourceType };
    }
    return { nodeId: parts[0], propIds: parts.slice(1), type: DataSourceType };
  }
  return { value: inputNodeId, type: DataSourceType }; // non-string literal
};

export const parseNodeName = (inputNodeId: any, version: number): DataSource => {
  if (version === 0.2) {
    return parseNodeName_02(inputNodeId);
  }
  if (typeof inputNodeId === "string") {
    const regex = /^:(.*)$/;
    const match = inputNodeId.match(regex);
    if (!match) {
      return { value: inputNodeId, type: DataSourceType }; // string literal
    }
    const parts = match[1].split(".");
    if (parts.length == 1) {
      return { nodeId: parts[0], type: DataSourceType };
    }
    return { nodeId: parts[0], propIds: parts.slice(1), type: DataSourceType };
  }
  return { value: inputNodeId, type: DataSourceType }; // non-string literal
};

export function assert(condition: boolean, message: string, isWarn: boolean = false): asserts condition {
  if (!condition) {
    if (!isWarn) {
      throw new Error(message);
    }
    console.warn("warn: " + message);
  }
}

export const isObject = (x: unknown) => {
  return x !== null && typeof x === "object";
};

const getNestedData = (result: ResultData, propId: string) => {
  if (Array.isArray(result)) {
    const regex = /^\$(\d+)$/;
    const match = propId.match(regex);
    if (match) {
      const index = parseInt(match[1], 10);
      return result[index];
    }
    if (propId === "$last") {
      return result[result.length - 1];
    }
  } else if (isObject(result)) {
    return (result as Record<string, any>)[propId];
  }
  return undefined;
};

const innerGetDataFromSource = (result: ResultData, propIds: string[] | undefined): ResultData | undefined => {
  if (result && propIds && propIds.length > 0) {
    const propId = propIds[0];
    const ret = getNestedData(result, propId);
    if (propIds.length > 1) {
      return innerGetDataFromSource(ret, propIds.slice(1));
    }
    return ret;
  }
  return result;
};

export const getDataFromSource = (result: ResultData | undefined, source: DataSource): ResultData | undefined => {
  if (!source.nodeId) {
    return source.value;
  }
  return innerGetDataFromSource(result, source.propIds);
};

export const strIntentionalError = "Intentional Error for Debugging";

export const defaultAgentInfo = {
  name: "defaultAgentInfo",
  samples: [
    {
      inputs: [],
      params: {},
      result: {},
    },
  ],
  description: "",
  category: [],
  author: "",
  repository: "",
  license: "",
};

export const agentInfoWrapper = (agent: AgentFunction<any, any, any, any>) => {
  return {
    agent,
    mock: agent,
    ...defaultAgentInfo,
  };
};

const objectToKeyArray = (innerData: any) => {
  const ret: string[][] = [];
  Object.keys(innerData).forEach((key: string) => {
    ret.push([key]);
    if (Object.keys(innerData[key]).length > 0) {
      objectToKeyArray(innerData[key]).forEach((tmp: string[]) => {
        ret.push([key, ...tmp]);
      });
    }
  });
  return ret;
};

export const debugResultKey = (agentId: string, result: any) => {
  return objectToKeyArray({ [agentId]: debugResultKeyInner(result) }).map((objectKeys: string[]) => {
    return ":" + objectKeys.join(".");
  });
};

const debugResultKeyInner = (result: any) => {
  if (result === null || result === undefined) {
    return {};
  }
  if (typeof result === "string") {
    return {};
  }
  if (Array.isArray(result)) {
    return Array.from(result.keys()).reduce((tmp: Record<string, any>, index: number) => {
      tmp["$" + String(index)] = debugResultKeyInner(result[index]);
      return tmp;
    }, {});
  }
  return Object.keys(result).reduce((tmp: Record<string, any>, key: string) => {
    tmp[key] = debugResultKeyInner(result[key]);
    return tmp;
  }, {});
};

export const isLogicallyTrue = (value: any) => {
  // Notice that empty aray is not true under GraphAI
  if (Array.isArray(value) ? value.length === 0 : !value) {
    return false;
  }
  return true;
};

export const defaultTestContext = {
  debugInfo: {
    nodeId: "test",
    retry: 0,
    verbose: true,
  },
  params: {},
  filterParams: {},
  agents: {},
  log: [],
};

export const isNamedInputs = <NamedInput = DefaultInputData>(namedInputs: NamedInput) => {
  return isObject(namedInputs) && !Array.isArray(namedInputs) && Object.keys(namedInputs || {}).length > 0;
};
