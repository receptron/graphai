import { AgentFunction } from "../graphai";
export declare const stringTemplateAgent: AgentFunction<{
    template: string;
    inputKey?: string;
}, {
    content: string;
}>;
