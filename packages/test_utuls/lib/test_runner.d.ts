import { GraphAI, GraphData, AgentFunctionInfoDictionary } from "graphai";
import { DefaultResultData } from "graphai/lib/type";
export declare const readGraphData: (file: string) => any;
export declare const fileTestRunner: (file: string, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback?: (graph: GraphAI) => void) => Promise<import("graphai").ResultDataDictionary<DefaultResultData>>;
export declare const graphDataTestRunner: <T = DefaultResultData>(logFileName: string, graph_data: GraphData, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback?: (graph: GraphAI) => void, all?: boolean) => Promise<import("graphai").ResultDataDictionary<T>>;
export declare const rejectFileTest: (file: string, errorMessage: string, agentFunctionInfoDictionary?: AgentFunctionInfoDictionary, validationError?: boolean) => Promise<void>;
export declare const rejectTest: (graphdata: GraphData, errorMessage: string, agentFunctionInfoDictionary?: AgentFunctionInfoDictionary, validationError?: boolean) => Promise<void>;
