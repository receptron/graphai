import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const sortByValuesAgent: AgentFunction<{
    assendant?: boolean;
}, Array<unknown>, null, {
    array: Array<unknown>;
    values: Array<unknown>;
}>;
declare const sortByValuesAgentInfo: AgentFunctionInfo;
export default sortByValuesAgentInfo;
