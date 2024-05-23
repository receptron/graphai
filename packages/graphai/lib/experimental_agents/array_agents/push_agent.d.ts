import { AgentFunction } from "../../index";
export declare const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>>;
declare const pushAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    samples: ({
        inputs: (number | number[])[];
        params: {};
        result: number[];
    } | {
        inputs: ({
            apple: number;
        }[] | {
            lemon: number;
        })[];
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
