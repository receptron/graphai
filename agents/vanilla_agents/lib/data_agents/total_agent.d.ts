import { AgentFunction } from "graphai";
export declare const totalAgent: AgentFunction<Record<never, never>, Record<string, number>>;
declare const totalAgentInfo: {
    name: string;
    agent: AgentFunction<Record<never, never>, Record<string, number>>;
    mock: AgentFunction<Record<never, never>, Record<string, number>>;
    inputs: {
        type: string;
    };
    output: {
        type: string;
    };
    samples: ({
        inputs: {
            a: number;
        }[];
        params: {};
        result: {
            a: number;
            b?: undefined;
            c?: undefined;
            d?: undefined;
        };
    } | {
        inputs: (({
            a: number;
            b: number;
            c?: undefined;
        } | {
            c: number;
            a?: undefined;
            b?: undefined;
        })[] | ({
            a: number;
            b: number;
            d?: undefined;
        } | {
            d: number;
            a?: undefined;
            b?: undefined;
        })[])[];
        params: {};
        result: {
            a: number;
            b: number;
            c: number;
            d: number;
        };
    } | {
        inputs: ({
            a: number;
            b?: undefined;
        } | {
            a: number;
            b: number;
        })[];
        params: {};
        result: {
            a: number;
            b: number;
            c?: undefined;
            d?: undefined;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default totalAgentInfo;
