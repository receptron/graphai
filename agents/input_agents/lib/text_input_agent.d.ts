import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const textInputAgent: AgentFunction<{
    message?: string;
    required?: boolean;
    role?: string;
}, {
    text: string;
    message: {
        role: string;
        content: string;
    };
}>;
declare const textInputAgentInfo: AgentFunctionInfo;
export default textInputAgentInfo;
