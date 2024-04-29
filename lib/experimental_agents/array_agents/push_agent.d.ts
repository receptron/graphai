import { AgentFunction } from "../../graphai";
export declare const pushAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>>;
declare const pushAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>>;
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
