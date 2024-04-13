import { GraphAI, GraphData } from "@/graphai";
import { bypassAgent, echoAgent } from "~/agents/agents";

import { graphDataTestRunner } from "~/utils/runner";

import test from "node:test";
import assert from "node:assert";

test("test bypass1", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        inputs: ["echo"],
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        inputs: ["bypassAgent"],
      },
    },
  };
  const result = await graphDataTestRunner("bypass.yml", graph_data, { echoAgent, bypassAgent });
  assert.deepStrictEqual(result, {
    bypassAgent2: {
      message: "hello",
    },
    bypassAgent: {
      message: "hello",
    },
    echo: {
      message: "hello",
    },
  });
  console.log("COMPLETE 1");
});

test("test bypass2", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        fork: 2,
        inputs: ["echo"],
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        inputs: ["bypassAgent"],
      },
    },
  };
  const result = await graphDataTestRunner("bypass2.yml", graph_data, { echoAgent, bypassAgent });
  console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: "hello" },
    bypassAgent_0: { message: "hello" },
    bypassAgent_1: { message: "hello" },
    bypassAgent2: [{ message: "hello" }, { message: "hello" }],
  });
  console.log("COMPLETE 1");
});

test("test bypass3", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        fork: 2,
        inputs: ["echo"],
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        fork: 2,
        inputs: ["bypassAgent"],
      },
      bypassAgent3: {
        agentId: "bypassAgent",
        fork: 2,
        inputs: ["bypassAgent2"],
      },
      bypassAgent4: {
        agentId: "bypassAgent",
        inputs: ["bypassAgent3"],
      },
    },
  };
  const result = await graphDataTestRunner("bypass2.yml", graph_data, { echoAgent, bypassAgent });
  console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: "hello" },
    bypassAgent_0: { message: "hello" },
    bypassAgent_1: { message: "hello" },
    bypassAgent2_0: { message: "hello" },
    bypassAgent2_1: { message: "hello" },
    bypassAgent3_0: { message: "hello" },
    bypassAgent3_1: { message: "hello" },
    bypassAgent4: [{ message: "hello" }, { message: "hello" }],
  });
  console.log("COMPLETE 1");
});

test("test bypass4", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agentId: "bypassAgent",
        fork: 2,
        inputs: ["echo"],
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        fork: 2,
        inputs: ["bypassAgent", "echo"],
      },
      bypassAgent3: {
        agentId: "bypassAgent",
        inputs: ["bypassAgent2"],
      },
    },
  };
  const result = await graphDataTestRunner("bypass2.yml", graph_data, { echoAgent, bypassAgent });
  assert.deepStrictEqual(result, {
    echo: { message: "hello" },
    bypassAgent_0: { message: "hello" },
    bypassAgent_1: { message: "hello" },
    bypassAgent2_0: [{ message: "hello" }, { message: "hello" }],
    bypassAgent2_1: [{ message: "hello" }, { message: "hello" }],
    bypassAgent3: [
      [{ message: "hello" }, { message: "hello" }],
      [{ message: "hello" }, { message: "hello" }],
    ],
  });
  console.log("COMPLETE 1");
});
