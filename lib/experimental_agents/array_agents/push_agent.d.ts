import { AgentFunction } from "../../graphai";
export declare const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>>;
declare const pushAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    samples: {
        inputs: (number | number[])[];
        params: {};
        result: number[];
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default pushAgentInfo;
