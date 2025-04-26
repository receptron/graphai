import { GraphAI } from "@/index";

import { graph_data_passthrough, graph_data_passthrough2, graph_data_passthrough_god, graph_data_passthrough_god_out } from "~/units/graph_data";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

test("test passthrough", async () => {
  const graph = new GraphAI(graph_data_passthrough, { ...agents });
  const res = await graph.run();

  // console.log(JSON.stringify(res, null, 2));
  assert.deepStrictEqual(res, {
    copyAgent: [
      {
        message: "hello",
        type: "bypass1",
      },
    ],
    copyAgent2: [
      {
        message: "hello",
        type: "bypass2",
      },
    ],
  });
});

test("test passthrough 2", async () => {
  const graph = new GraphAI(graph_data_passthrough2, { ...agents });
  const res = await graph.run();

  assert.deepStrictEqual(res, {
    copyAgent: {
      echo: {
        message: "hello",
      },
      type: "bypass1",
    },
    copyAgent2: {
      bypass: {
        echo: {
          message: "hello",
        },
        type: "bypass1",
      },
      type: "bypass2",
    },
  });

  // console.log(JSON.stringify(res, null, 2));
});

test("test passthrough god format", async () => {
  const graph = new GraphAI(graph_data_passthrough_god, { ...agents });
  const res = await graph.run();

  assert.deepStrictEqual(res, {
    copyAgent: {
      echo: {
        message: "hello",
      },
      type: "hello",
    },
  });

  // console.log(JSON.stringify(res, null, 2));
});

test("test passthrough god format", async () => {
  const graph = new GraphAI(graph_data_passthrough_god_out, { ...agents });
  const res = await graph.run();

  assert.deepStrictEqual(res, {
    copyAgent: {
      result: "hello",
      pass: "hello",
    },
  });

  // console.log(JSON.stringify(res, null, 2));
});
