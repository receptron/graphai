import { AgentFunction } from "../../graphai";
export declare const wikipediaAgent: AgentFunction<{
    lang?: string;
    summary?: boolean;
}, Record<string, any> | undefined, string>;
declare const wikipediaAgentInfo: {
    name: string;
    agent: AgentFunction<{
        lang?: string | undefined;
        summary?: boolean | undefined;
    }, Record<string, any> | undefined, string>;
    mock: AgentFunction<{
        lang?: string | undefined;
        summary?: boolean | undefined;
    }, Record<string, any> | undefined, string>;
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default wikipediaAgentInfo;
