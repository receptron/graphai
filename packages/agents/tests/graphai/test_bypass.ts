import * as agents from "@graphai/vanilla";
import { graphDataTestRunner } from "@receptron/test_utils";

import test from "node:test";
import assert from "node:assert";

test("test bypass1", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        inputs: [":echo"],
      },
      bypassAgent2: {
        agent: "bypassAgent",
        inputs: [":bypassAgent.$0"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, agents);
  // console.log(JSON.stringify(result));
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
        agent: "echoAgent",
        params: {
          message: ["hello", "hello"],
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":echo.message" },
        graph: {
          version: 0.3,
          nodes: {
            bypassAgent: {
              agent: "bypassAgent",
              inputs: [":row"],
              isResult: true,
              params: {
                firstElement: true,
              },
            },
          },
        },
      },
      bypassAgent2: {
        agent: "bypassAgent",
        inputs: [":mapNode.bypassAgent"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, "test_bypass_2", graph_data, agents);
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
    version: 0.3,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: ["hello", "hello"],
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":echo.message" },
        graph: {
          version: 0.3,
          nodes: {
            bypassAgent: {
              agent: "bypassAgent",
              inputs: [":row"],
            },
            bypassAgent2: {
              agent: "bypassAgent",
              inputs: [":bypassAgent.$0"],
            },
            bypassAgent3: {
              agent: "bypassAgent",
              inputs: [":bypassAgent2.$0"],
              params: {
                firstElement: true,
              },
              isResult: true,
            },
          },
        },
      },
      bypassAgent4: {
        agent: "bypassAgent",
        params: {
          firstElement: true,
        },
        inputs: [":mapNode.bypassAgent3"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, "test_bypass_3", graph_data, agents);
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
    version: 0.3,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: ["hello", "hello"],
        },
      },
      mapNode: {
        agent: "mapAgent",
        inputs: { rows: ":echo.message" },
        graph: {
          version: 0.3,
          nodes: {
            bypassAgent: {
              agent: "bypassAgent",
              inputs: [":row"],
            },
            bypassAgent2: {
              agent: "bypassAgent",
              inputs: [":bypassAgent.$0", ":row"],
              isResult: true,
            },
          },
        },
      },
      bypassAgent3: {
        agent: "bypassAgent",
        inputs: [":mapNode.bypassAgent2"],
        params: {
          firstElement: true,
        },
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, "test_bypass_4", graph_data, agents);
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

///

test("test bypass 5", async () => {
  const graph_data = {
    version: 0.3,
    nodes: {
      echo: {
        agent: "echoAgent",
        params: {
          message: "hello",
        },
      },
      bypassAgent: {
        agent: "bypassAgent",
        inputs: [":echo", ":echo", ":echo"],
      },
      bypassAgent2: {
        agent: "bypassAgent",
        inputs: [":bypassAgent", ":bypassAgent"],
      },
      bypassAgent3: {
        agent: "bypassAgent",
        inputs: [":bypassAgent2", ":bypassAgent2"],
      },
    },
  };
  const result = await graphDataTestRunner(__dirname, __filename, graph_data, agents);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, {
    echo: { message: "hello" },
    bypassAgent: [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
    bypassAgent2: [
      [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
      [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
    ],
    bypassAgent3: [
      [
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
      ],
      [
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
        [{ message: "hello" }, { message: "hello" }, { message: "hello" }],
      ],
    ],
  });
  // console.log("COMPLETE 1");
});
