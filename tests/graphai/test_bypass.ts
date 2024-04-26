import { defaultTestAgents } from "~/agents/agents";

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
  const result = await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
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
  // console.log("COMPLETE 1");
});

test("test bypass2", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: ["hello", "hello"],
        },
      },
      mapNode: {
        agentId: "mapAgent",
        inputs: ["echo.message"],
        params: {
          injectionTo: "memory",
          resultFrom: "bypassAgent",
        },
        graph: {
          nodes: {
            memory: {
              value: {},
            },
            bypassAgent: {
              agentId: "bypassAgent",
              inputs: ["memory"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent2: {
        agentId: "bypassAgent",
        inputs: ["mapNode.bypassAgent"],
      },
    },
  };
  const result = await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
  console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { bypassAgent: ["hello", "hello"] },
    bypassAgent2: ["hello", "hello"],
  });
  // console.log("COMPLETE 1");
});

test("test bypass3", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: ["hello", "hello"],
        },
      },
      mapNode: {
        agentId: "mapAgent",
        inputs: ["echo.message"],
        params: {
          injectionTo: "memory",
          resultFrom: "bypassAgent3",
        },
        graph: {
          nodes: {
            memory: {
              value: {},
            },
            bypassAgent: {
              agentId: "bypassAgent",
              inputs: ["memory"],
            },
            bypassAgent2: {
              agentId: "bypassAgent",
              inputs: ["bypassAgent"],
            },
            bypassAgent3: {
              agentId: "bypassAgent",
              inputs: ["bypassAgent2"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent4: {
        agentId: "bypassAgent",
        inputs: ["mapNode.bypassAgent3"],
      },
    },
  };
  const result = await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
  // console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { bypassAgent3: ["hello", "hello"] },
    bypassAgent4: ["hello", "hello"],
  });
  // console.log("COMPLETE 1");
});

test("test bypass4", async () => {
  const graph_data = {
    nodes: {
      echo: {
        agentId: "echoAgent",
        params: {
          message: ["hello", "hello"],
        },
      },
      mapNode: {
        agentId: "mapAgent",
        inputs: ["echo.message"],
        params: {
          injectionTo: "memory",
          resultFrom: "bypassAgent2",
        },
        graph: {
          nodes: {
            memory: {
              value: {},
            },
            bypassAgent: {
              agentId: "bypassAgent",
              inputs: ["memory"],
            },
            bypassAgent2: {
              agentId: "bypassAgent",
              inputs: ["bypassAgent", "memory"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent3: {
        agentId: "bypassAgent",
        inputs: ["mapNode.bypassAgent2"],
      },
    },
  };
  const result = await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
  // console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: {
      bypassAgent2: [
        ["hello", "hello"],
        ["hello", "hello"],
      ],
    },
    bypassAgent3: [
      ["hello", "hello"],
      ["hello", "hello"],
    ],
  });

  // console.log("COMPLETE 1");
});
