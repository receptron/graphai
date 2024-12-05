import { AgentFunction, agentInfoWrapper } from "graphai";

import { graphDataTestRunner } from "@receptron/test_utils";

import test from "node:test";
import assert from "node:assert";

const httpAgent: AgentFunction = async ({ params, namedInputs }) => {
  const { agent, params: postParams } = params;
  const url = "http://localhost:8085/agents/" + agent;

  const postData = { params: postParams, namedInputs };

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

test("test copy1", async () => {
  const graph_data = {
    version: 0.5,
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
      copyAgent: {
        agent: "httpAgent",
        inputs: { message: ":echo.message" },
        params: {
          agent: "copyAgent",
        },
      },
      copyAgent2: {
        agent: "httpAgent",
        inputs: { message: ":copyAgent.message" },
        params: {
          agent: "copyAgent",
        },
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  assert.deepStrictEqual(result, {
    copyAgent2: {
      message: "hello",
    },
    copyAgent: {
      message: "hello",
    },
    echo: {
      message: "hello",
    },
  });
  // console.log("COMPLETE 1");
});

test("test copy2", async () => {
  const graph_data = {
    version: 0.5,
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
        inputs: { rows: ":echo.message" },
        params: {
          compositeResult: true,
        },
        graph: {
          version: 0.5,
          nodes: {
            copyAgent: {
              agent: "httpAgent",
              params: {
                agent: "copyAgent",
                params: {
                  firstElement: true,
                },
              },
              inputs: { row: ":row" },
              isResult: true,
            },
          },
        },
      },
      copyAgent2: {
        agent: "httpAgent",
        params: {
          agent: "copyAgent",
        },
        inputs: { rows: ":mapNode.copyAgent" },
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  // console.log(JSON.stringify(result, null, 2));
  assert.deepStrictEqual(result, {
    echo: {
      message: ["hello", "hello"],
    },
    mapNode: {
      copyAgent: [
        {
          row: "hello",
        },
        {
          row: "hello",
        },
      ],
    },
    copyAgent2: {
      rows: [
        {
          row: "hello",
        },
        {
          row: "hello",
        },
      ],
    },
  });
  // console.log("COMPLETE 1");
});

test("test copy3", async () => {
  const graph_data = {
    version: 0.5,
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
        inputs: { rows: ":echo.message" },
        params: {
          compositeResult: true,
        },
        graph: {
          version: 0.5,
          nodes: {
            copyAgent: {
              agent: "httpAgent",
              params: {
                agent: "copyAgent",
              },
              inputs: { item: ":row" },
            },
            copyAgent2: {
              agent: "httpAgent",
              params: {
                agent: "copyAgent",
              },
              inputs: { item: ":copyAgent.item" },
            },
            copyAgent3: {
              agent: "httpAgent",
              params: {
                agent: "copyAgent",
              },
              inputs: { item: ":copyAgent2.item" },
              isResult: true,
            },
          },
        },
      },
      copyAgent4: {
        agent: "httpAgent",
        params: {
          agent: "copyAgent",
        },
        inputs: { data: ":mapNode.copyAgent3" },
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, "http_test_copy_3", graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  // console.log(result);
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: { copyAgent3: [{ item: "hello" }, { item: "hello" }] },
    copyAgent4: {
      data: [{ item: "hello" }, { item: "hello" }],
    },
  });
  // console.log("COMPLETE 1");
});

test("test copy4", async () => {
  const graph_data = {
    version: 0.5,
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
        inputs: { rows: ":echo.message" },
        params: {
          compositeResult: true,
        },
        graph: {
          version: 0.5,
          nodes: {
            memory: {
              value: {},
            },
            copyAgent: {
              agent: "httpAgent",
              params: {
                agent: "copyAgent",
              },
              inputs: { row: ":row" },
            },
            copyAgent2: {
              agent: "httpAgent",
              params: {
                agent: "copyAgent",
              },
              inputs: { a: ":copyAgent.row", b: ":row" },
              isResult: true,
            },
          },
        },
      },
      copyAgent3: {
        agent: "httpAgent",
        params: {
          agent: "copyAgent",
        },
        inputs: { data: ":mapNode.copyAgent2" },
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, { httpAgent: agentInfoWrapper(httpAgent) });
  assert.deepStrictEqual(result, {
    echo: { message: ["hello", "hello"] },
    mapNode: {
      copyAgent2: [
        { a: "hello", b: "hello" },
        { a: "hello", b: "hello" },
      ],
    },
    copyAgent3: {
      data: [
        { a: "hello", b: "hello" },
        { a: "hello", b: "hello" },
      ],
    },
  });
  // console.log("COMPLETE 1");
});
