import { StaticNode } from "@/node";
import { DataSourceType } from "@/type";
import { resultsOf } from "@/result";
import { GraphAI } from "@/graphai";

import { graph_data } from "./graph_data";
import * as agents from "../test_agents";

import test from "node:test";
import assert from "node:assert";

const graph = new GraphAI(graph_data, agents);

const getStaticNode = (nodeId: string, value?: string) => {
  const dataSource = { value: undefined, __type: DataSourceType };
  const node = new StaticNode(nodeId, dataSource, graph);
  if (value) {
    node.injectValue(value)
  }
  return node;
};

test("test result", async () => {
  const dataSources = { text: [ { nodeId: 'message', __type: DataSourceType }  ] }
  const node = getStaticNode("message", "123");
  const result = resultsOf(dataSources, {message: node});
  assert.deepStrictEqual(result, { text: [ '123' ] });
});


test("test result for anyInput", async () => {
  const dataSources = { text: [ { nodeId: 'message1', __type: DataSourceType }, { nodeId: 'message2', __type: DataSourceType }  ] }
  const node1 = getStaticNode("message1", "123");
  const node2 = getStaticNode("message2");
  const result = resultsOf(dataSources, {message1: node1, message2: node2});
  assert.deepStrictEqual(result, { text: [ '123', undefined ] });
});
