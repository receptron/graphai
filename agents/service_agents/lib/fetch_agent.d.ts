import { AgentFunction } from "graphai";
export declare const fetchAgent: AgentFunction<{
    debug?: boolean;
    type?: string;
}, any, any>;
declare const fetchAgentInfo: {
    name: string;
    agent: AgentFunction<{
        debug?: boolean | undefined;
        type?: string | undefined;
    }, any, any>;
    mock: AgentFunction<{
        debug?: boolean | undefined;
        type?: string | undefined;
    }, any, any>;
    inputs: {
        type: string;
        properties: {
            url: {
                type: string;
                description: string;
            };
            method: {
                type: string;
                description: string;
            };
            headers: {
                type: string;
                description: string;
            };
            quaryParams: {
                type: string;
                description: string;
            };
            body: {
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
            url: string;
            queryParams: {
                foo: string;
            };
            headers: {
                "x-myHeader": string;
            };
            body?: undefined;
        };
        params: {
            debug: boolean;
        };
        result: {
            method: string;
            url: string;
            headers: {
                "x-myHeader": string;
                "Content-Type"?: undefined;
            };
            body: undefined;
        };
    } | {
        inputs: {
            url: string;
            body: {
                foo: string;
            };
            queryParams?: undefined;
            headers?: undefined;
        };
        params: {
            debug: boolean;
        };
        result: {
            method: string;
            url: string;
            headers: {
                "Content-Type": string;
                "x-myHeader"?: undefined;
            };
            body: string;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default fetchAgentInfo;
