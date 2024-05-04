import { AgentFunction } from "../../graphai";
export declare const rssAgent: AgentFunction<undefined, any, string>;
declare const rssAgentInfo: {
    name: string;
    agent: AgentFunction<undefined, any, string>;
    mock: AgentFunction<undefined, any, string>;
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default rssAgentInfo;
