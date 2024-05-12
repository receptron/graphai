import { AgentFunction } from "../graphai";
export declare const tokenBoundStringsAgent: AgentFunction<{
    limit?: number;
}, {
    content: string;
}, Array<string>>;
declare const tokenBoundStringsAgentInfo: {
    name: string;
    agent: AgentFunction<{
        limit?: number | undefined;
    }, {
        content: string;
    }, string[]>;
    mock: AgentFunction<{
        limit?: number | undefined;
    }, {
        content: string;
    }, string[]>;
    samples: {
        inputs: string[][];
        params: {
            limit: number;
        };
        result: {
            content: string;
            tokenCount: number;
            endIndex: number;
        };
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default tokenBoundStringsAgentInfo;
