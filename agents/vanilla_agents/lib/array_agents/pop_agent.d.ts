import { AgentFunction } from "graphai";
export declare const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>, {
    array: Array<any>;
}>;
declare const popAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, any[], {
        array: Array<any>;
    }>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, any[], {
        array: Array<any>;
    }>;
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
            array2?: undefined;
        };
        params: {};
        result: {
            array: number[];
            item: number;
        };
    } | {
        inputs: {
            array: string[];
            array2?: undefined;
        };
        params: {};
        result: {
            array: string[];
            item: string;
        };
    } | {
        inputs: {
            array: number[];
            array2: string[];
        };
        params: {};
        result: {
            array: number[];
            item: number;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default popAgentInfo;
