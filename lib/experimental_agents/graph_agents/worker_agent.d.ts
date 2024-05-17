import { AgentFunction } from "../../index";
export declare const workerAgent: AgentFunction<{
    namedInputs?: Array<string>;
}, any, any>;
declare const workerAgentInfo: {
    name: string;
    agent: AgentFunction<{
        namedInputs?: string[] | undefined;
    }, any, any>;
    mock: AgentFunction<{
        namedInputs?: string[] | undefined;
    }, any, any>;
    samples: {
        inputs: string[];
        params: {};
        result: {
            message: string;
        };
        graph: {
            version: number;
            nodes: {
                source: {
                    value: string;
                };
                message: {
                    agent: string;
                    inputs: string[];
                    isResult: boolean;
                };
            };
        };
    }[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default workerAgentInfo;
