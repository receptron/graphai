import { AgentFunction } from "../../index";
import { ManifestData, ChatData } from "slashgpt";
export declare const slashGPTAgent: AgentFunction<{
    manifest: ManifestData;
    query?: string;
    function_result?: boolean;
}, ChatData[], string>;
declare const slashGPTAgentInfo: {
    name: string;
    agent: AgentFunction<{
        manifest: ManifestData;
        query?: string | undefined;
        function_result?: boolean | undefined;
    }, ChatData[], string>;
    mock: AgentFunction<{
        manifest: ManifestData;
        query?: string | undefined;
        function_result?: boolean | undefined;
    }, ChatData[], string>;
    samples: {
        inputs: never[];
        params: {
            query: string;
        };
        result: {
            role: string;
            content: string;
            preset: boolean;
        }[];
    }[];
    skipTest: boolean;
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
    stream: boolean;
    npms: string[];
};
export default slashGPTAgentInfo;
