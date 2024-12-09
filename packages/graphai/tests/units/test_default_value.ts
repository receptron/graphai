import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";
import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

test("test if default value 1", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      message: {
        value: {
          text: "Hello World",
          result: true,
        },
      },
      copy: {
        agent: "copyAgent",
        inputs: {
          text: ":message.text",
        },
        if: ":message.result",
      },
      result: {
        agent: "copyAgent",
        inputs: {
          text: ":copy.text",
        },
        isResult: true,
      },
    },
  };

  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      text: "Hello World",
    },
  });
});

test("test if default value 2", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      message: {
        value: {
          text: "Hello World",
          result: false,
        },
      },
      copy: {
        agent: "copyAgent",
        inputs: {
          text: ":message.text",
        },
        if: ":message.result",
        defaultValue: {
          text: "this is default",
        },
      },
      result: {
        agent: "copyAgent",
        inputs: {
          text: ":copy.text",
        },
        isResult: true,
      },
    },
  };

  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      text: "this is default",
    },
  });
});
