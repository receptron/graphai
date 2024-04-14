import { AgentFunction } from "../graphai";
export declare const sleeperAgent: AgentFunction<{
    duration: number;
    result?: Record<string, any>;
}>;
export declare const sleeperAgentDebug: AgentFunction<{
    duration: number;
    result?: Record<string, any>;
    fail?: boolean;
}>;
