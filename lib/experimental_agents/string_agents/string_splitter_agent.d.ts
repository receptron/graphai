import { AgentFunction } from "../../graphai";
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
    samples: {
        inputs: string[];
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
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default stringSplitterAgentInfo;
