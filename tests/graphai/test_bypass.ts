import { defaultTestAgents } from "@/utils/test_agents";
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
        inputs: ["bypassAgent.$0"],
      },
    },
  };
  const result = await graphDataTestRunner(__filename, graph_data, defaultTestAgents);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    bypassAgent2: [{
      message: "hello",
    }],
    bypassAgent: [{
      message: "hello",
    }],
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
        graph: {
          nodes: {
            bypassAgent: {
              agentId: "bypassAgent",
              inputs: ["$0"],
              isResult: true,
              params: {
                firstElement: true,
              },
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
  const result = await graphDataTestRunner("test_bypass_2", graph_data, defaultTestAgents);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { bypassAgent: ["hello", "hello"] },
    bypassAgent2: [["hello", "hello"]],
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
        graph: {
          nodes: {
            bypassAgent: {
              agentId: "bypassAgent",
              inputs: ["$0"],
            },
            bypassAgent2: {
              agentId: "bypassAgent",
              inputs: ["bypassAgent.$0"],
            },
            bypassAgent3: {
              agentId: "bypassAgent",
              inputs: ["bypassAgent2.$0"],
              params: {
                firstElement: true,
              },
              isResult: true,
            },
          },
        },
      },
      bypassAgent4: {
        agentId: "bypassAgent",
        params: {
          firstElement: true,
        },
        inputs: ["mapNode.bypassAgent3"],
      },
    },
  };
  const result = await graphDataTestRunner("test_bypass_3", graph_data, defaultTestAgents);
  // console.log( JSON.stringify(result));
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
        graph: {
          nodes: {
            bypassAgent: {
              agentId: "bypassAgent",
              inputs: ["$0"],
            },
            bypassAgent2: {
              agentId: "bypassAgent",
              inputs: ["bypassAgent.$0", "$0"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent3: {
        agentId: "bypassAgent",
        inputs: ["mapNode.bypassAgent2"],
        params: {
          firstElement: true,
        },
      },
    },
  };
  const result = await graphDataTestRunner("test_bypass_4", graph_data, defaultTestAgents);
  // console.log( JSON.stringify(result));
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
