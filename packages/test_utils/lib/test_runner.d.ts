import { GraphAI, GraphData, AgentFunctionInfoDictionary, DefaultResultData } from "graphai";
export declare const readGraphData: (baseDir: string, file: string) => any;
export declare const fileTestRunner: (baseDir: string, file: string, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback?: (graph: GraphAI) => void) => Promise<import("graphai").ResultDataDictionary<DefaultResultData>>;
export declare const graphDataTestRunner: <T = DefaultResultData>(logBaseDir: string, logFileName: string, graph_data: GraphData, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback?: (graph: GraphAI) => void, all?: boolean) => Promise<import("graphai").ResultDataDictionary<T>>;
export declare const rejectFileTest: (baseDir: string, file: string, errorMessage: string, agentFunctionInfoDictionary?: AgentFunctionInfoDictionary, validationError?: boolean) => Promise<void>;
export declare const rejectTest: (logBaseDir: string, graphdata: GraphData, errorMessage: string, agentFunctionInfoDictionary?: AgentFunctionInfoDictionary, validationError?: boolean) => Promise<void>;
