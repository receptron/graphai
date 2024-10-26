import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const fetchAgent: AgentFunction<{
    debug?: boolean;
    type?: string;
    throwError?: boolean;
}, any, any>;
declare const fetchAgentInfo: AgentFunctionInfo;
export default fetchAgentInfo;
