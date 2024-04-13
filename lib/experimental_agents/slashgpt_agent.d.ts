import { AgentFunction } from "../graphai";
import { ManifestData } from "slashgpt";
export declare const slashGPTAgent: AgentFunction<{
    manifest: ManifestData;
    query?: string;
}, {
    content: string;
}>;
