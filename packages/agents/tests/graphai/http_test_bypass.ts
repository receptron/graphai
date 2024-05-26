import { AgentFunction } from "graphai";

import { graphDataTestRunner } from "@graphai/test_utils";
import { agentInfoWrapper } from "graphai/utils";

import test from "node:test";
import assert from "node:assert";

const httpAgent: AgentFunction = async ({ inputs, params }) => {
  const { agent, params: postParams } = params;
  const url = "http://localhost:8085/agents/" + agent;

  const postData = { inputs, params: postParams };

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  const result = await response.json();
  return result;
};

test("test bypass1", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "httpAgent",
        params: {
          agent: "echoAgent",
          params: {
            message: "hello",
          },
        },
      },
      bypassAgent: {
        agent: "httpAgent",
        inputs: [":echo"],
        params: {
          agent: "bypassAgent",
        },
      },
      bypassAgent2: {
        agent: "httpAgent",
        inputs: [":bypassAgent.$0"],
        params: {
          agent: "bypassAgent",
        },
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  assert.deepStrictEqual(result, {
    bypassAgent2: [
      {
        message: "hello",
      },
    ],
    bypassAgent: [
      {
        message: "hello",
      },
    ],
    echo: {
      message: "hello",
    },
  });
  // console.log("COMPLETE 1");
});

test("test bypass2", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "httpAgent",
        params: {
          agent: "echoAgent",
          params: {
            message: ["hello", "hello"],
          },
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: [":echo.message"],
        graph: {
          version: 0.3,
          nodes: {
            bypassAgent: {
              agent: "httpAgent",
              params: {
                agent: "bypassAgent",
                params: {
                  firstElement: true,
                },
              },
              inputs: [":$0"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent2: {
        agent: "httpAgent",
        params: {
          agent: "bypassAgent",
        },
        inputs: [":mapNode.bypassAgent"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  // console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { bypassAgent: ["hello", "hello"] },
    bypassAgent2: [["hello", "hello"]],
  });
  // console.log("COMPLETE 1");
});

test("test bypass3", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "httpAgent",
        params: {
          agent: "echoAgent",
          params: {
            message: ["hello", "hello"],
          },
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: [":echo.message"],
        graph: {
          version: 0.3,
          nodes: {
            bypassAgent: {
              agent: "httpAgent",
              params: {
                agent: "bypassAgent",
              },
              inputs: [":$0"],
            },
            bypassAgent2: {
              agent: "httpAgent",
              params: {
                agent: "bypassAgent",
              },
              inputs: [":bypassAgent.$0"],
            },
            bypassAgent3: {
              agent: "httpAgent",
              params: {
                agent: "bypassAgent",
                params: {
                  firstElement: true,
                },
              },
              inputs: [":bypassAgent2.$0"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent4: {
        agent: "httpAgent",
        params: {
          agent: "bypassAgent",
          params: {
            firstElement: true,
          },
        },
        inputs: [":mapNode.bypassAgent3"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, "http_test_bypass_3", graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
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
    version: 0.3,
    nodes: {
      echo: {
        agent: "httpAgent",
        params: {
          agent: "echoAgent",
          params: {
            message: ["hello", "hello"],
          },
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: [":echo.message"],
        params: {
          namedInputs: ["memory"],
        },
        graph: {
          version: 0.3,
          nodes: {
            memory: {
              value: {},
            },
            bypassAgent: {
              agent: "httpAgent",
              params: {
                agent: "bypassAgent",
              },
              inputs: [":memory"],
            },
            bypassAgent2: {
              agent: "httpAgent",
              params: {
                agent: "bypassAgent",
              },
              inputs: [":bypassAgent.$0", ":memory"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent3: {
        agent: "httpAgent",
        params: {
          agent: "bypassAgent",
          firstElement: true,
        },
        inputs: [":mapNode.bypassAgent2"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: {
      bypassAgent2: [
        ["hello", "hello"],
        ["hello", "hello"],
      ],
    },
    bypassAgent3: [
      [
        ["hello", "hello"],
        ["hello", "hello"],
      ],
    ],
  });
  // console.log("COMPLETE 1");
});
