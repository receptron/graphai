import { DataSource, AgentFunction, AgentFunctionInfo, DefaultInputData, NodeData, StaticNodeData, ComputedNodeData, NodeState } from "../type";
export declare const sleep: (milliseconds: number) => Promise<unknown>;
export declare const parseNodeName: (inputNodeId: any, isSelfNode?: boolean) => DataSource;
export declare function assert(condition: boolean, message: string, isWarn?: boolean): asserts condition;
export declare const isObject: (x: unknown) => x is object;
export declare const isNull: (data: unknown) => data is null | undefined;
export declare const strIntentionalError = "Intentional Error for Debugging";
export declare const defaultAgentInfo: {
    name: string;
    samples: {
        inputs: never[];
        params: {};
        result: {};
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export declare const agentInfoWrapper: (agent: AgentFunction<any, any, any, any>) => AgentFunctionInfo;
export declare const debugResultKey: (agentId: string, result: any) => string[];
export declare const isLogicallyTrue: (value: any) => boolean;
export declare const defaultTestContext: {
    debugInfo: {
        nodeId: string;
        retry: number;
        verbose: boolean;
        state: NodeState;
        subGraphs: Map<any, any>;
    };
    params: {};
    filterParams: {};
    agents: {};
    log: never[];
};
export declare const isNamedInputs: <NamedInput = DefaultInputData>(namedInputs: NamedInput) => boolean;
export declare const isComputedNodeData: (node: NodeData) => node is ComputedNodeData;
export declare const isStaticNodeData: (node: NodeData) => node is StaticNodeData;
