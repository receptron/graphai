import { AgentFunction } from "../../graphai";
export declare const dotProductAgent: AgentFunction<Record<string, any>, {
    contents: Array<number>;
}, Array<Array<number>>>;
declare const dotProductAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, {
        contents: Array<number>;
    }, number[][]>;
    mock: AgentFunction<Record<string, any>, {
        contents: Array<number>;
    }, number[][]>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default dotProductAgentInfo;
