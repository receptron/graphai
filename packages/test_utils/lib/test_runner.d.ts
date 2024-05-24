import { GraphAI, GraphData, AgentFunctionInfoDictionary } from "graphai";
import { DefaultResultData } from "graphai/lib/type";
export declare const readGraphData: (base_dir: string, file: string) => any;
export declare const fileTestRunner: (base_dir: string, file: string, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback?: (graph: GraphAI) => void) => Promise<import("graphai").ResultDataDictionary<DefaultResultData>>;
export declare const graphDataTestRunner: <T = DefaultResultData>(base_dir: string, logFileName: string, graph_data: GraphData, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback?: (graph: GraphAI) => void, all?: boolean) => Promise<import("graphai").ResultDataDictionary<T>>;
export declare const rejectFileTest: (base_dir: string, file: string, errorMessage: string, agentFunctionInfoDictionary?: AgentFunctionInfoDictionary, validationError?: boolean) => Promise<void>;
export declare const rejectTest: (base_dir: string, graphdata: GraphData, errorMessage: string, agentFunctionInfoDictionary?: AgentFunctionInfoDictionary, validationError?: boolean) => Promise<void>;
