import { AgentFunction } from "graphai";
export declare const dotProductAgent: AgentFunction<Record<never, never>, Array<number>, Array<Array<number>> | Array<number>>;
declare const dotProductAgentInfo: {
    name: string;
    agent: AgentFunction<Record<never, never>, number[], number[] | number[][]>;
    mock: AgentFunction<Record<never, never>, number[], number[] | number[][]>;
    inputs: {
        type: string;
        properties: {
            matrix: {
                type: string;
                description: string;
            };
            vector: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    output: {
        type: string;
    };
    samples: {
        inputs: {
            matrix: number[][];
            vector: number[];
        };
        params: {};
        result: number[];
    }[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default dotProductAgentInfo;
