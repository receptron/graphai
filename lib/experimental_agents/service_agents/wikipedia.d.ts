import { AgentFunction } from "../../index";
export declare const wikipediaAgent: AgentFunction<{
    lang?: string;
    summary?: boolean;
}, Record<string, any> | undefined, string>;
declare const wikipediaAgentInfo: {
    name: string;
    agent: AgentFunction<{
        lang?: string | undefined;
        summary?: boolean | undefined;
    }, Record<string, any> | undefined, string>;
    mock: AgentFunction<{
        lang?: string | undefined;
        summary?: boolean | undefined;
    }, Record<string, any> | undefined, string>;
    description: string;
    category: string[];
    samples: {
        inputs: string[];
        params: {
            lang: string;
        };
        result: {
            content: string;
            ns: number;
            title: string;
            pageid: number;
        };
    }[];
    skipTest: boolean;
    author: string;
    repository: string;
    license: string;
};
export default wikipediaAgentInfo;
