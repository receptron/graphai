import path from "path";

import { GraphAI, AgentFunctionInfoDictionary } from "graphai";
import { readGraphaiData } from "./file_utils";
import { graphDataTestRunner } from "./test_runner";

export const fileTestRunner = async (file: string, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback: (graph: GraphAI) => void = () => {}) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  return await graphDataTestRunner(file, graph_data, agentFunctionInfoDictionary, callback);
};
