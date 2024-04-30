import { AgentFunction } from "../../graphai";
export declare const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>>;
declare const popAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    samples: ({
        inputs: string[][];
        params: {};
        result: {
            array: string[];
            item: string;
        };
    } | {
        inputs: (string[] | number[])[];
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
