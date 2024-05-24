// this is copy from graphai. dont't update
import { GraphAI, GraphData, AgentFunctionInfoDictionary, AgentFunctionInfo } from "graphai";
import { NodeState, DefaultResultData } from "graphai/lib/type";
import { defaultTestContext } from "graphai/lib/utils/test_utils";

import * as defaultTestAgents from "@graphai/vanilla";

import { readGraphaiData, mkdirLogDir, fileBaseName } from "./file_utils";
import { ValidationError } from "graphai/lib/validators/common";

import path from "path";
import * as fs from "fs";

import assert from "node:assert";
import test from "node:test";

export const readGraphData = (base_dir: string, file: string) => {
  const file_path = path.resolve(base_dir) + "/.." + file;
  return readGraphaiData(file_path);
};

export const fileTestRunner = async (
  base_dir: string,
  file: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary,
  callback: (graph: GraphAI) => void = () => {},
) => {
  return await graphDataTestRunner(base_dir, file, readGraphData(base_dir, file), agentFunctionInfoDictionary, callback);
};

export const graphDataTestRunner = async <T = DefaultResultData>(
  base_dir: string,
  logFileName: string,
  graph_data: GraphData,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary,
  callback: (graph: GraphAI) => void = () => {},
  all: boolean = true,
) => {
  mkdirLogDir();

  const log_path = path.resolve(base_dir) + "/../logs/" + fileBaseName(logFileName) + ".log";
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
  base_dir: string,
  file: string,
  errorMessage: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary = {},
  validationError: boolean = true,
) => {
  return await rejectTest(base_dir, readGraphData(base_dir, file), errorMessage, agentFunctionInfoDictionary, validationError);
};
export const rejectTest = async (
  base_dir: string,
  graphdata: GraphData,
  errorMessage: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary = {},
  validationError: boolean = true,
) => {
  await assert.rejects(
    async () => {
      await graphDataTestRunner(base_dir, __filename, graphdata, { ...defaultTestAgents, ...agentFunctionInfoDictionary });
    },
    { name: "Error", message: validationError ? new ValidationError(errorMessage).message : errorMessage },
  );
};


// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo) => {
  const { agent, samples, skipTest } = agentInfo;
  if (samples.length === 0) {
    console.log(`test ${agentInfo.name}: No test`);
  } else if (skipTest) {
    console.log(`test ${agentInfo.name}: skip`);
  } else {
    for await (const sampleKey of samples.keys()) {
      test(`test ${agentInfo.name} ${sampleKey}`, async () => {
        const { params, inputs, result, graph } = samples[sampleKey];

        const actual = await agent({
          ...defaultTestContext,
          params,
          inputs,
          graphData: graph,
        });
        assert.deepStrictEqual(actual, result);
      });
    }
  }
};
