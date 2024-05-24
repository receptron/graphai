import { AgentFunction } from "graphai";
export declare const jsonParserAgent: AgentFunction<{
    stringify: boolean;
}, any, any>;
declare const jsonParserAgentInfo: {
    name: string;
    agent: AgentFunction<{
        stringify: boolean;
    }, any, any>;
    mock: AgentFunction<{
        stringify: boolean;
    }, any, any>;
    samples: ({
        inputs: {
            apple: string;
            lemon: string;
        }[];
        params: {
            stringify: boolean;
        };
        result: string;
    } | {
        inputs: string[];
        params: {
            stringify?: undefined;
        };
        result: {
            apple: string;
            lemon: string;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default jsonParserAgentInfo;
