import { AgentFunction } from "graphai";
export declare const copyAgent: AgentFunction;
declare const copyAgentInfo: {
    name: string;
    agent: AgentFunction;
    mock: AgentFunction;
    samples: ({
        inputs: {
            color: string;
            model: string;
        }[];
        params: {};
        result: {
            color: string;
            model: string;
        };
    } | {
        inputs: string[];
        params: {};
        result: string;
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default copyAgentInfo;
