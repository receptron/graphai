import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const dataSumTemplateAgent: AgentFunction<{
    flatResponse?: boolean;
}, number | {
    result: number;
}, {
    array: number[];
}>;
declare const dataSumTemplateAgentInfo: AgentFunctionInfo;
export default dataSumTemplateAgentInfo;
