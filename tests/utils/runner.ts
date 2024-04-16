import { GraphAI, GraphData, AgentFunctionDictonary } from "@/graphai";
import path from "path";
import * as fs from "fs";
import { readGraphaiData, mkdirLogDir } from "~/utils/file_utils";

export const fileTestRunner = async (file: string, callbackDictonary: AgentFunctionDictonary, callback: (graph: GraphAI) => void = () => {}) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  const graph_data = readGraphaiData(file_path);
  return await graphDataTestRunner(file, graph_data, callbackDictonary, callback);
};

export const graphDataTestRunner = async (
  logFileName: string,
  graph_data: GraphData,
  callbackDictonary: AgentFunctionDictonary,
  callback: (graph: GraphAI) => void = () => {},
) => {
  mkdirLogDir();

  const log_path = path.resolve(__dirname) + "/../logs/" + path.basename(logFileName).replace(/\.(ya?ml)|.(ts)$/, ".log");
  const graph = new GraphAI(graph_data, callbackDictonary);
  callback(graph);

  try {
    const results = await graph.run();
    fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
    // console.log(graph.transactionLogs());
    return results;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    }
    fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
    // console.log(graph.transactionLogs());
    return graph.results();
  }
};
