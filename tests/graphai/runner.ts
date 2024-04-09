import { GraphAI, AgentFunctionDictonary, AgentFunction } from "@/graphai";
import path from "path";
import * as fs from 'fs';
import { readGraphaiData } from "~/file_utils";

export const runTest = async (
  file: string,
  callbackDictonary: AgentFunctionDictonary | AgentFunction<any, any, any>,
  callback: (graph: GraphAI) => void = () => {}
) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  const log_path = path.resolve(__dirname) + "/../logs/" + path.basename(file_path).replace(/\.yml$/, ".log");
  const graph_data = readGraphaiData(file_path);
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
    // console.log(graph.transactionLogs());
    return graph.results();
  }
};
