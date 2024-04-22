import { AgentFunction } from "../graphai";
import { ManifestData } from "slashgpt";
export declare const slashGPTAgent: AgentFunction<{
    manifest: ManifestData;
    query?: string;
    function_result?: boolean;
    inputKey?: string;
}, {
    content: string;
}>;
