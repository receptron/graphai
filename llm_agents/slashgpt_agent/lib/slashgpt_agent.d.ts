import { AgentFunction, AgentFunctionInfo } from "graphai";
import { ManifestData, ChatData } from "slashgpt";
export declare const slashGPTAgent: AgentFunction<{
    manifest: ManifestData;
    query?: string;
    function_result?: boolean;
}, ChatData[], {
    array?: string[];
}>;
declare const slashGPTAgentInfo: AgentFunctionInfo;
export default slashGPTAgentInfo;
