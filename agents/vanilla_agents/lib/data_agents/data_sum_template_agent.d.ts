import { AgentFunction } from "graphai";
export declare const dataSumTemplateAgent: AgentFunction<Record<string, any>, number, number>;
declare const dataSumTemplateAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, number, number>;
    mock: AgentFunction<Record<string, any>, number, number>;
    inputs: {
        type: string;
    };
    output: {
        type: string;
    };
    samples: {
        inputs: number[];
        params: {};
        result: number;
    }[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default dataSumTemplateAgentInfo;
