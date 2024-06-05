import { AgentFunction } from "graphai";
export declare const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>>;
declare const shiftAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    inputs: {
        type: string;
        properties: {
            array: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    output: {
        type: string;
        properties: {
            item: {
                type: string;
                description: string;
            };
            array: {
                type: string;
                description: string;
            };
        };
    };
    samples: ({
        inputs: {
            array: number[];
        };
        params: {};
        result: {
            array: number[];
            item: number;
        };
    } | {
        inputs: {
            array: string[];
        };
        params: {};
        result: {
            array: string[];
            item: string;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default shiftAgentInfo;
