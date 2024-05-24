import { AgentFunction } from "graphai";
export declare const stringEmbeddingsAgent: AgentFunction<{
    model?: string;
}, any, Array<string> | string>;
declare const stringEmbeddingsAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model?: string | undefined;
    }, any, string | string[]>;
    mock: AgentFunction<{
        model?: string | undefined;
    }, any, string | string[]>;
    samples: never[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default stringEmbeddingsAgentInfo;
