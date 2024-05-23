import { DataSource, ResultData, AgentFunction } from "../type";
export declare const sleep: (milliseconds: number) => Promise<unknown>;
export declare const parseNodeName: (inputNodeId: any, version: number) => DataSource;
export declare function assert(condition: boolean, message: string, isWarn?: boolean): asserts condition;
export declare const isObject: (x: unknown) => boolean;
export declare const getDataFromSource: (result: ResultData | undefined, source: DataSource) => ResultData | undefined;
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
export declare const agentInfoWrapper: (agent: AgentFunction<any, any, any>) => {
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
    agent: AgentFunction<any, any, any>;
    mock: AgentFunction<any, any, any>;
};
export declare const debugResultKey: (agentId: string, result: any) => string[];
export declare const isLogicallyTrue: (value: any) => boolean;
