import { AgentFunction } from "../../graphai";
export declare const dotProductAgent: AgentFunction<Record<never, never>, Array<number>, Array<Array<number>> | Array<number>>;
declare const dotProductAgentInfo: {
    name: string;
    agent: AgentFunction<Record<never, never>, number[], number[] | number[][]>;
    mock: AgentFunction<Record<never, never>, number[], number[] | number[][]>;
    samples: {
        inputs: (number[] | number[][])[];
        params: {};
        result: number[];
    }[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default dotProductAgentInfo;
