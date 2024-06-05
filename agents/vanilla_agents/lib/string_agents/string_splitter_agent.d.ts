import { AgentFunction } from "graphai";
export declare const stringSplitterAgent: AgentFunction<{
    chunkSize?: number;
    overlap?: number;
}, {
    contents: Array<string>;
}, string>;
declare const stringSplitterAgentInfo: {
    name: string;
    agent: AgentFunction<{
        chunkSize?: number | undefined;
        overlap?: number | undefined;
    }, {
        contents: Array<string>;
    }, string>;
    mock: AgentFunction<{
        chunkSize?: number | undefined;
        overlap?: number | undefined;
    }, {
        contents: Array<string>;
    }, string>;
    inputs: {
        type: string;
        properties: {
            text: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    output: {
        type: string;
        properties: {
            contents: {
                type: string;
                description: string;
            };
            count: {
                type: string;
                description: string;
            };
            chunkSize: {
                type: string;
                description: string;
            };
            overlap: {
                type: string;
                description: string;
            };
        };
    };
    samples: {
        inputs: {
            text: string;
        };
        params: {
            chunkSize: number;
        };
        result: {
            contents: string[];
            count: number;
            chunkSize: number;
            overlap: number;
        };
    }[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default stringSplitterAgentInfo;
