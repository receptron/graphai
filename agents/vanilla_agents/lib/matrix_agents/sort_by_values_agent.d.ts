import { AgentFunction } from "graphai";
export declare const sortByValuesAgent: AgentFunction<{
    assendant?: boolean;
}, Array<any>, Array<any>>;
declare const sortByValuesAgentInfo: {
    name: string;
    agent: AgentFunction<{
        assendant?: boolean | undefined;
    }, any[], any[]>;
    mock: AgentFunction<{
        assendant?: boolean | undefined;
    }, any[], any[]>;
    inputs: {
        type: string;
        properties: {
            array: {
                type: string;
                description: string;
            };
            values: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    output: {
        type: string;
    };
    samples: ({
        inputs: {
            array: string[];
            values: number[];
        };
        params: {
            assendant?: undefined;
        };
        result: string[];
    } | {
        inputs: {
            array: string[];
            values: number[];
        };
        params: {
            assendant: boolean;
        };
        result: string[];
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default sortByValuesAgentInfo;
