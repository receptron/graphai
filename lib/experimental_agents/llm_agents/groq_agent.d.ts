import { AgentFunction } from "../../graphai";
export declare const gloqAgent: AgentFunction<{
    model: string;
    query?: string;
    system?: string;
}, Record<string, any> | string, string>;
declare const gloqAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
    }, string | Record<string, any>, string>;
    mock: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
    }, string | Record<string, any>, string>;
    samples: never[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default gloqAgentInfo;
