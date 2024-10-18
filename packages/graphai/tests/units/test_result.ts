import { graphDataLatestVersion } from "~/common";
import { StaticNode, ComputedNode } from "@/node";
import { DataSourceType } from "@/type";
import { resultsOf, cleanResult } from "@/result";
import { TaskManager } from "@/task_manager";
import { GraphAI } from "@/graphai";

// import { graph_data } from "./graph_data";
import * as agents from "../test_agents";

import test from "node:test";
import assert from "node:assert";

export const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    data1: {
      value: "1",
    },
    message1: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    message2: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
      inputs: { test: [":data1", ":bypassAgent"] },
      anyInput: true,
    },
    bypassAgent: {
      agent: "bypassAgent",
      params: { namedKey: "text" },
      inputs: { text: ":message1" },
    },
    bypassAgent2: {
      agent: "bypassAgent",
      params: { namedKey: "text" },
      inputs: { text: ":message2" },
    },
  },
};

class DummyTaskManager extends TaskManager {
  public onComplete(__node: ComputedNode) {}
}

const taskManager = new DummyTaskManager(10);

const graph = new GraphAI(graph_data, agents, { taskManager });
graph.run();

const getStaticNode = (nodeId: string, value?: string) => {
  const dataSource = { value: undefined, __type: DataSourceType };
  const node = new StaticNode(nodeId, dataSource, graph);
  if (value) {
    node.injectValue(value);
  }
  return node;
};

const getComputedNode = (nodeId: string) => {
  const nodeData = {
    agent: "echoAgent",
    params: { message: "hello" },
  };
  const node = new ComputedNode("123", nodeId, nodeData, graph);
  return node;
};

test("test result", async () => {
  const dataSources = { text: [{ nodeId: "message", __type: DataSourceType }] };
  const node = getStaticNode("message", "123");
  const result = resultsOf(dataSources, { message: node });
  assert.deepStrictEqual(result, { text: ["123"] });
});

test("test result for anyInput", async () => {
  const dataSources = {
    text: [
      { nodeId: "message1", __type: DataSourceType },
      { nodeId: "message2", __type: DataSourceType },
    ],
  };
  const node1 = getStaticNode("message1", "123");
  const node2 = getStaticNode("message2");
  const result = resultsOf(dataSources, { message1: node1, message2: node2 });
  assert.deepStrictEqual(result, { text: ["123", undefined] });
});

test("test result for anyInput", async () => {
  const dataSources = {
    text: [
      { nodeId: "message1", __type: DataSourceType },
      { nodeId: "message2", __type: DataSourceType },
    ],
  };
  const node1 = getStaticNode("message1", "123");
  const node2 = getStaticNode("message2");
  const result = cleanResult(resultsOf(dataSources, { message1: node1, message2: node2 }));
  assert.deepStrictEqual(result, { text: ["123"] });
});

test("test computed node result", async () => {
  const dataSources = {
    text: [
      { nodeId: "message1", __type: DataSourceType },
      { nodeId: "message2", __type: DataSourceType },
    ],
  };
  const node1 = getComputedNode("message1");
  const node2 = getComputedNode("message2");
  await node1.execute();
  const result = resultsOf(dataSources, { message1: node1, message2: node2 });
  assert.deepStrictEqual(result, { text: [{ message: "hello" }, undefined] });
});
