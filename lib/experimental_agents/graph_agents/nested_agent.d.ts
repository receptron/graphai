import { AgentFunction } from "../../graphai";
import { GraphData } from "../../type";
export declare const getNestedGraphData: (graphData: GraphData | string | undefined, inputs: Array<any>) => GraphData;
export declare const nestedAgent: AgentFunction<{
    injectionTo?: Array<string>;
}>;
declare const nestedAgentInfo: {
    name: string;
    agent: AgentFunction<{
        injectionTo?: string[] | undefined;
    }>;
    mock: AgentFunction<{
        injectionTo?: string[] | undefined;
    }>;
    samples: never[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default nestedAgentInfo;
