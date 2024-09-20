import { GraphAI } from "@/index";

import { graph_data_while, graph_data_do_while } from "~/units/graph_data";

import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

test("test while", async () => {
  const graph = new GraphAI(graph_data_while, agents);
  const res = await graph.run();
  assert.deepStrictEqual(res, { result: 0 });
});

test("test do while", async () => {
  const graph = new GraphAI(graph_data_do_while, agents);
  const res = await graph.run();
  assert.deepStrictEqual(res, { result: 1, next: 0 });
});
