import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const vanillaFetchAgent: AgentFunction<{
    debug?: boolean;
    type?: string;
    throwError?: boolean;
}, any, any>;
declare const vanillaFetchAgentInfo: AgentFunctionInfo;
export default vanillaFetchAgentInfo;
