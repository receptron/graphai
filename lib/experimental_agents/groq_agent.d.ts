import { AgentFunction } from "../graphai";
export declare const gloqAgent: AgentFunction<{
    model: string;
    prompt: string;
}, Record<string, any> | string, string>;
