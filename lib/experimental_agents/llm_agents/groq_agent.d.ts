import { AgentFunction } from "../../graphai";
export declare const groqAgent: AgentFunction<{
    model: string;
    query?: string;
    system?: string;
    verbose?: boolean;
}, Record<string, any> | string, string | Array<Record<string, any>>>;
declare const groqAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
    }, string | Record<string, any>, string | Record<string, any>[]>;
    mock: AgentFunction<{
        model: string;
        query?: string | undefined;
        system?: string | undefined;
        verbose?: boolean | undefined;
    }, string | Record<string, any>, string | Record<string, any>[]>;
    samples: never[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default groqAgentInfo;
