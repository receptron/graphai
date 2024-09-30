import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const arrayJoinAgent: AgentFunction<{
    separator?: string;
    flat?: number;
}, {
    text: string;
}, Array<never>, {
    array: Array<unknown>;
}>;
declare const arrayJoinAgentInfo: AgentFunctionInfo;
export default arrayJoinAgentInfo;
