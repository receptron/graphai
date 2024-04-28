import { AgentFunction } from "../../graphai";
export declare const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>>;
declare const popAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, Record<string, any>>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default popAgentInfo;
