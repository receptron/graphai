import { AgentFunction } from "../../graphai";
export declare const dataObjectMergeTemplateAgent: AgentFunction;
declare const dataObjectMergeTemplateAgentInfo: {
    name: string;
    agent: AgentFunction;
    mock: AgentFunction;
    samples: ({
        inputs: ({
            a: number;
            b: number;
            c?: undefined;
        } | {
            a: number;
            b: number;
            c: number;
        })[];
        params: {};
        result: {
            a: number;
            b: number;
            c: number;
        };
    } | {
        inputs: ({
            a: {
                b: {
                    c: {
                        d: string;
                    };
                };
            };
            b?: undefined;
        } | {
            b: {
                c: {
                    d: {
                        e: string;
                    };
                };
                d?: undefined;
            };
            a?: undefined;
        } | {
            b: {
                d: {
                    e: {
                        f: string;
                    };
                };
                c?: undefined;
            };
            a?: undefined;
        })[];
        params: {};
        result: {
            a: {
                b: {
                    c: {
                        d: string;
                    };
                };
            };
            b: {
                c: {
                    d: {
                        e: string;
                    };
                };
                d: {
                    e: {
                        f: string;
                    };
                };
            };
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default dataObjectMergeTemplateAgentInfo;
