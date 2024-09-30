import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const arrayFlatAgent: AgentFunction<{
    depth?: number;
}, {
    array: Array<unknown>;
}, Array<never>, {
    array: Array<unknown>;
}>;
declare const arrayFlatAgentInfo: AgentFunctionInfo;
export default arrayFlatAgentInfo;
