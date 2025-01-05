import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const stringCaseVariantsAgent: AgentFunction<{
    suffix?: string;
}, {
    lowerCamelCase: string;
    snakeCase: string;
    kebabCase: string;
    normalized: string;
}, {
    text: string;
}>;
declare const stringCaseVariantsAgentInfo: AgentFunctionInfo;
export default stringCaseVariantsAgentInfo;
