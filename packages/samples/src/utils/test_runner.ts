// this is copy from graphai. dont't update
import { GraphAI, GraphData, AgentFunctionInfoDictionary } from "graphai";
import { NodeState, DefaultResultData } from "graphai/lib/type";

import { defaultTestAgents } from "graphai/lib/utils/test_agents";
import { readGraphaiData, mkdirLogDir, fileBaseName } from "./file_utils";
import { ValidationError } from "graphai/lib/validators/common";

import path from "path";
import * as fs from "fs";

import assert from "node:assert";

export const readGraphData = (file: string) => {
  const file_path = path.resolve(__dirname) + "/.." + file;
  return readGraphaiData(file_path);
};

export const fileTestRunner = async (file: string, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, callback: (graph: GraphAI) => void = () => {}) => {
  return await graphDataTestRunner(file, readGraphData(file), agentFunctionInfoDictionary, callback);
};

export const graphDataTestRunner = async <T = DefaultResultData>(
  logFileName: string,
  graph_data: GraphData,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary,
  callback: (graph: GraphAI) => void = () => {},
  all: boolean = true,
) => {
  mkdirLogDir();

  const log_path = path.resolve(__dirname) + "/../logs/" + fileBaseName(logFileName) + ".log";
  const graph = new GraphAI(graph_data, { ...defaultTestAgents, ...agentFunctionInfoDictionary });

  if (process.argv[2] === "-v") {
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

  const results = await graph.run<T>(all);
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  return results;
};

export const rejectFileTest = async (
  file: string,
  errorMessage: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary = {},
  validationError: boolean = true,
) => {
  return await rejectTest(readGraphData(file), errorMessage, agentFunctionInfoDictionary, validationError);
};
export const rejectTest = async (
  graphdata: GraphData,
  errorMessage: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary = {},
  validationError: boolean = true,
) => {
  await assert.rejects(
    async () => {
      await graphDataTestRunner(__filename, graphdata, { ...defaultTestAgents, ...agentFunctionInfoDictionary });
    },
    { name: "Error", message: validationError ? new ValidationError(errorMessage).message : errorMessage },
  );
};
