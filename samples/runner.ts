import path from "path";

import { GraphAI, AgentFunctionDictonary, AgentFunction } from "@/graphai";
import { readGraphaiData } from "~/utils/file_utils";
import { graphDataTestRunner } from "~/utils/runner";

export const fileTestRunner = async (
  file: string,
  callbackDictonary: AgentFunctionDictonary | AgentFunction<any, any, any>,
  callback: (graph: GraphAI) => void = () => {},
) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  return await graphDataTestRunner(file, graph_data, callbackDictonary, callback);
};
