import { AgentFunction } from "../../graphai";
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
    samples: never[];
    description: string;
    category: never[];
    author: string;
    repository: string;
    license: string;
};
export default slashGPTAgentInfo;
