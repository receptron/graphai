import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const jsonParserAgent: AgentFunction<null, unknown, null, {
    text: string;
    data: unknown;
}>;
declare const jsonParserAgentInfo: AgentFunctionInfo;
export default jsonParserAgentInfo;
