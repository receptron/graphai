import { AgentFunction } from "../../index";
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
    samples: ({
        inputs: (string | {
            foo: string;
            "x-myHeader"?: undefined;
        } | {
            "x-myHeader": string;
            foo?: undefined;
        })[];
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
        inputs: (string | {
            foo: string;
        } | undefined)[];
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
