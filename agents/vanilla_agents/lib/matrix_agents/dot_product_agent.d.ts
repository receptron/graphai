import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const dotProductAgent: AgentFunction<Record<never, never>, Array<number>, null, {
    matrix: Array<Array<number>>;
    vector: Array<number>;
}>;
declare const dotProductAgentInfo: AgentFunctionInfo;
export default dotProductAgentInfo;
