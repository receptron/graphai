import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIWithOptionalArrayAndItem } from "@graphai/agent_utils";
export declare const propertyFilterAgent: AgentFunction<{
    include?: Array<string>;
    exclude?: Array<string>;
    alter?: Record<string, Record<string, string>>;
    inject?: Array<Record<string, any>>;
    inspect?: Array<Record<string, any>>;
    swap?: Record<string, string>;
}, unknown, GraphAIWithOptionalArrayAndItem>;
declare const propertyFilterAgentInfo: AgentFunctionInfo;
export default propertyFilterAgentInfo;
