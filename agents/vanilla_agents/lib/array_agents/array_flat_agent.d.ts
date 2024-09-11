import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const arrayFlatAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>, {
    array: Array<unknown>;
    depth?: number;
}>;
declare const arrayFlatAgentInfo: AgentFunctionInfo;
export default arrayFlatAgentInfo;
