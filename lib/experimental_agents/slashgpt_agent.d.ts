import { AgentFunction } from "../graphai";
import { ManifestData } from "slashgpt";
export declare const slashGPTAgent: AgentFunction<{
    manifest: ManifestData;
    query?: string;
    function_result?: boolean;
}, {
    content: string;
}, string>;
declare const slashGPTAgentInfo: {
    name: string;
    agent: AgentFunction<{
        manifest: ManifestData;
        query?: string | undefined;
        function_result?: boolean | undefined;
    }, {
        content: string;
    }, string>;
    mock: AgentFunction<{
        manifest: ManifestData;
        query?: string | undefined;
        function_result?: boolean | undefined;
    }, {
        content: string;
    }, string>;
    samples: never[];
    description: string;
    author: string;
    repository: string;
    license: string;
};
export default slashGPTAgentInfo;
