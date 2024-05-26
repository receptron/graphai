import path from "path";

import { GraphAI, AgentFunctionInfoDictionary } from "graphai";
import { readGraphaiData } from "@graphai/test_utils";
import { graphDataTestRunner } from "@graphai/test_utils";

export const fileTestRunner = async (file: string, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback: (graph: GraphAI) => void = () => {}) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  return await graphDataTestRunner(__dirname +  "/../", file, graph_data, agentFunctionInfoDictionary, callback);
};
