import { AgentFunction } from "graphai";
export declare const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>>;
declare const pushAgentInfo: {
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
            item: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    output: {
        type: string;
    };
    samples: ({
        inputs: {
            array: number[];
            item: number;
        };
        params: {};
        result: number[];
    } | {
        inputs: {
            array: {
                apple: number;
            }[];
            item: {
                lemon: number;
            };
        };
        params: {};
        result: ({
            apple: number;
            lemon?: undefined;
        } | {
            lemon: number;
            apple?: undefined;
        })[];
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default pushAgentInfo;
