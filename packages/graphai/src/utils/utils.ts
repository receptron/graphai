import { DataSource, AgentFunction, AgentFunctionInfo, DefaultInputData, NodeData, StaticNodeData, ComputedNodeData, NodeState } from "../type";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const parseNodeName = (inputNodeId: any, isSelfNode: boolean = false): DataSource => {
  if (isSelfNode) {
    if (typeof inputNodeId === "string" && inputNodeId[0] === ".") {
      const parts = inputNodeId.split(".");
      return { nodeId: "self", propIds: parts.slice(1) };
    }
    return { value: inputNodeId };
  }
  if (typeof inputNodeId === "string") {
    const regex = /^:(.*)$/;
    const match = inputNodeId.match(regex);
    if (!match) {
      return { value: inputNodeId }; // string literal
    }
    const parts = match[1].split(".");
    if (parts.length == 1) {
      return { nodeId: parts[0] };
    }
    return { nodeId: parts[0], propIds: parts.slice(1) };
  }
  return { value: inputNodeId }; // non-string literal
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

export const isNull = (data: unknown) => {
  return data === null || data === undefined;
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

export const agentInfoWrapper = (agent: AgentFunction<any, any, any, any>): AgentFunctionInfo => {
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
    state: NodeState.Executing,
    subGraphs: new Map(),
  },
  params: {},
  filterParams: {},
  agents: {},
  log: [],
};

export const isNamedInputs = <NamedInput = DefaultInputData>(namedInputs: NamedInput) => {
  return isObject(namedInputs) && !Array.isArray(namedInputs) && Object.keys(namedInputs || {}).length > 0;
};

export const isComputedNodeData = (node: NodeData): node is ComputedNodeData => {
  return "agent" in node;
};

export const isStaticNodeData = (node: NodeData): node is StaticNodeData => {
  return !("agent" in node);
};
