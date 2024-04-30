import { AgentFunction } from "../graphai";
export declare const functionAgent: AgentFunction<{
    function: (...args: any[]) => any;
}>;
declare const functionAgentInfo: {
    name: string;
    agent: AgentFunction<{
        function: (...args: any[]) => any;
    }>;
    mock: AgentFunction<{
        function: (...args: any[]) => any;
    }>;
    samples: ({
        inputs: {
            model: string;
            maker: string;
            range: number;
            price: number;
        }[];
        params: {
            function: (info: Record<string, any>) => string;
        };
        result: string;
    } | {
        inputs: string[];
        params: {
            function: (str: string) => any;
        };
        result: {
            model: string;
            maker: string;
            range: number;
            price: number;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default functionAgentInfo;
