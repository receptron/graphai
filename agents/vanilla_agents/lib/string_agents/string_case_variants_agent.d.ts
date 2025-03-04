import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIText } from "@graphai/agent_utils";
export declare const stringCaseVariantsAgent: AgentFunction<{
    suffix?: string;
}, {
    lowerCamelCase: string;
    snakeCase: string;
    kebabCase: string;
    normalized: string;
}, GraphAIText>;
declare const stringCaseVariantsAgentInfo: AgentFunctionInfo;
export default stringCaseVariantsAgentInfo;
