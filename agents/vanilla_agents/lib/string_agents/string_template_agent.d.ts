import { AgentFunction, AgentFunctionInfo } from "graphai";
type StringTemplate = string | Record<string, string>;
type StringTemplateObject = StringTemplate | StringTemplate[] | Record<string, StringTemplate>;
export declare const stringTemplateAgent: AgentFunction<{
    template: StringTemplateObject;
}, StringTemplateObject, string, Record<string, string>>;
declare const stringTemplateAgentInfo: AgentFunctionInfo;
export default stringTemplateAgentInfo;
