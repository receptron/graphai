import { AgentFunction } from "../../graphai";
export declare const dataObjectMergeTemplateAgent: AgentFunction;
declare const dataObjectMergeTemplateAgentInfo: {
    name: string;
    agent: AgentFunction;
    mock: AgentFunction;
    samples: {
        inputs: ({
            a: number;
            b: number;
            c?: undefined;
        } | {
            a: number;
            b: number;
            c: number;
        })[];
        params: {};
        result: {
            a: number;
            b: number;
        };
    }[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default dataObjectMergeTemplateAgentInfo;
