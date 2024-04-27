import { GraphAI, GraphData, AgentFunctionDictonary } from "@/graphai";
import { NodeState } from "@/type";

import { defaultTestAgents } from "@/utils/test_agents";
import { readGraphaiData, mkdirLogDir, fileBaseName } from "~/utils/file_utils";

import path from "path";
import * as fs from "fs";

import assert from "node:assert";

export const readGraphData = (file: string) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  return readGraphaiData(file_path);
};

export const fileTestRunner = async (file: string, callbackDictonary: AgentFunctionDictonary, callback: (graph: GraphAI) => void = () => {}) => {
  return await graphDataTestRunner(file, readGraphData(file), callbackDictonary, callback);
};

export const graphDataTestRunner = async (
  logFileName: string,
  graph_data: GraphData,
  callbackDictonary: AgentFunctionDictonary,
  callback: (graph: GraphAI) => void = () => {},
  all: boolean = true,
) => {
  mkdirLogDir();

  const log_path = path.resolve(__dirname) + "/../logs/" + fileBaseName(logFileName) + ".log";
  const graph = new GraphAI(graph_data, { ...defaultTestAgents, ...callbackDictonary });

  if (process.argv[2] !== "-q") {
    graph.onLogCallback = ({ nodeId, state, inputs, result, errorMessage }) => {
      if (state === NodeState.Executing) {
        console.log(`${nodeId.padEnd(10)} =>( ${(JSON.stringify(inputs) ?? "").slice(0, 60)}`);
      } else if (state === NodeState.Injected || state == NodeState.Completed) {
        const shortName = state === NodeState.Injected ? "=  " : "{} ";
        console.log(`${nodeId.padEnd(10)} ${shortName} ${(JSON.stringify(result) ?? "").slice(0, 60)}`);
      } else if (state == NodeState.Failed) {
        console.log(`${nodeId.padEnd(10)} ERR ${(errorMessage ?? "").slice(0, 60)}`);
      } else {
        console.log(`${nodeId.padEnd(10)} ${state}`);
      }
    };
  }

  callback(graph);

  const results = await graph.run(all);
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  return results;
};

export const rejectFileTest = async (file: string, errorMessage: string, callbackDictonary: AgentFunctionDictonary = {}) => {
  return await rejectTest(readGraphData(file), errorMessage, callbackDictonary);
};
export const rejectTest = async (graphdata: GraphData, errorMessage: string, callbackDictonary: AgentFunctionDictonary = {}) => {
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graphdata, { ...defaultTestAgents, ...callbackDictonary });
    },
    { name: "Error", message: errorMessage },
  );
};
