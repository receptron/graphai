import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIBaseDirName, GraphAIFileName, GraphAIOutputType, GraphAIArray, GraphAIData } from "@graphai/agent_utils";
import fs from "fs";
type ResponseData = string | Buffer | fs.ReadStream;
export declare const fileReadAgent: AgentFunction<GraphAIBaseDirName & Partial<GraphAIOutputType>, Partial<GraphAIArray<ResponseData> & GraphAIData<ResponseData>>, Partial<GraphAIArray<string> & GraphAIFileName>>;
declare const fileReadAgentInfo: AgentFunctionInfo;
export default fileReadAgentInfo;
