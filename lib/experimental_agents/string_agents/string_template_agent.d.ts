import { AgentFunction } from "../../graphai";
export declare const stringTemplateAgent: AgentFunction<{
    template: string;
}, Record<string, any> | string, string>;
