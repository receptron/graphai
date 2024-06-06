import { AgentFunction } from "graphai";
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
    inputs: {
        type: string;
        properties: {
            chunks: {
                type: string;
                description: string;
            };
        };
    };
    output: {
        type: string;
        properties: {
            content: {
                type: string;
                description: string;
            };
            tokenCount: {
                type: string;
                description: string;
            };
            endIndex: {
                type: string;
                description: string;
            };
        };
    };
    samples: {
        inputs: {
            chunks: string[];
        };
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
