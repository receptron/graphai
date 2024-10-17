// for test_dynamic_graph

const graphdata_child = {
  version: 0.5,
  loop: {
    count: 5,
  },
  nodes: {
    array: {
      value: [],
      update: ":reducer",
    },
    item: {
      agent: "sleeperAgent",
      params: {
        duration: 10,
        value: "hello",
      },
    },
    reducer: {
      isResult: true,
      agent: "pushAgent",
      inputs: { array: ":array", item: ":item" },
    },
  },
};

export const dynamicGraphData = {
  version: 0.5,
  nodes: {
    source: {
      value: graphdata_child,
    },
    nested: {
      agent: "nestedAgent",
      graph: ":source",
      isResult: true,
    },
  },
};

export const dynamicGraphData2 = {
  version: 0.5,
  nodes: {
    source: {
      value: JSON.stringify(graphdata_child),
    },
    parser: {
      agent: "jsonParserAgent",
      inputs: { text: ":source" },
    },
    nested: {
      agent: "nestedAgent",
      graph: ":parser",
      isResult: true,
    },
  },
};

export const dynamicGraphData3 = {
  version: 0.5,
  nodes: {
    source: {
      value: "```json\n" + JSON.stringify(graphdata_child) + "\n```\n",
    },
    parser: {
      agent: "jsonParserAgent",
      inputs: { text: ":source" },
    },
    nested: {
      agent: "nestedAgent",
      graph: ":parser",
      isResult: true,
    },
  },
};

// for test_nest_agent

export const nestedGraphData = {
  version: 0.5,
  nodes: {
    source: {
      value: "Hello World",
    },
    nestedNode: {
      agent: "nestedAgent",
      inputs: { inner0: ":source" },
      isResult: true,
      graph: {
        nodes: {
          result: {
            agent: "copyAgent",
            inputs: { text: ":inner0" },
            isResult: true,
          },
        },
      },
    },
  },
};

export const nestedGraphData2 = {
  version: 0.5,
  nodes: {
    source: {
      value: "Hello World",
    },
    nestedNode: {
      agent: "nestedAgent",
      inputs: { source: ":source" },
      isResult: true,
      graph: {
        nodes: {
          result: {
            agent: "copyAgent",
            inputs: { text: ":source" },
            isResult: true,
          },
        },
      },
    },
  },
};

// test_map

export const graphDataMap1 = {
  version: 0.5,
  nodes: {
    source: {
      value: {
        fruits: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
      },
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source.fruits",
      },
      graph: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${m}.",
            },
            inputs: { m: ":row" },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "sleeperAgent",
      inputs: { array: [":nestedNode.node2"] },
      isResult: true,
    },
  },
};

export const graphDataMap3 = {
  version: 0.5,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source1",
      },
      graph: {
        version: 0.5,
        nodes: {
          node1: {
            agent: "bypassAgent",
            params: { namedKey: "row" },
            inputs: {row: ":row"},
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "bypassAgent",
      params: { namedKey: "result" },
      inputs: { result: [":nestedNode.node1"]},
      isResult: true,
    },
  },
};

export const graphDataMap4 = {
  version: 0.5,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source1",
      },
      graph: {
        version: 0.5,
        nodes: {
          node1: {
            agent: "bypassAgent",
            params: { namedKey: "row" },
            inputs: {row: ":row"},
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "bypassAgent",
      params: {
        namedKey: "result",
      },
      inputs: {result: ":nestedNode.node1"},
    },
  },
};

export const graphDataMap5 = {
  version: 0.5,
  nodes: {
    source1: {
      value: ["hello", "hello2"],
    },
    nestedNode: {
      agent: "mapAgent",
      inputs: {
        rows: ":source1",
      },
      graph: {
        version: 0.5,
        nodes: {
          node1: {
            agent: "bypassAgent",
            params: { namedKey: "row" },
            inputs: {row: ":row"},
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "bypassAgent",
      params: {
        flat: 2,
      },
      inputs: [":nestedNode.node1"],
    },
  },
};

// test_loop_push

export const graphDataPush = {
  version: 0.5,
  loop: {
    count: 10,
  },
  nodes: {
    array: {
      value: [],
      update: ":reducer",
    },
    item: {
      agent: "sleeperAgent",
      params: {
        duration: 10,
        value: "hello",
      },
    },
    reducer: {
      isResult: true,
      agent: "pushAgent",
      inputs: { array: ":array", item: ":item" },
    },
  },
};

export const graphDataPop = {
  version: 0.5,
  loop: {
    while: ":source",
  },
  nodes: {
    source: {
      value: ["orange", "banana", "lemon"],
      update: ":popper.array",
    },
    result: {
      value: [],
      update: ":reducer",
    },
    popper: {
      inputs: { array: ":source" },
      agent: "popAgent", // returns { array, item }
    },
    reducer: {
      agent: "pushAgent",
      inputs: { array: ":result", item: ":popper.item" },
    },
  },
};

// test_loop_nested_array

export const graphDataNested = {
  version: 0.5,
  nodes: {
    source: {
      value: "hello",
    },
    parent: {
      agent: "nestedAgent",
      inputs: { source: ":source" },
      isResult: true,
      graph: {
        loop: {
          count: 10,
        },
        nodes: {
          array: {
            value: [],
            update: ":reducer",
          },
          item: {
            agent: "sleeperAgent",
            params: {
              duration: 10,
              value: ":source",
            },
          },
          reducer: {
            agent: "pushAgent",
            inputs: { array: ":array", item: ":item" },
            isResult: true,
          },
        },
      },
    },
  },
};

export const graphDataNestedPop = {
  version: 0.5,
  nodes: {
    fruits: {
      value: ["orange", "banana", "lemon"],
    },
    parent: {
      agent: "nestedAgent",
      isResult: true,
      inputs: { fruits: ":fruits" },
      graph: {
        loop: {
          while: ":fruits",
        },
        nodes: {
          fruits: {
            value: [], // it will be filled with inputs[0]
            update: ":popper.array",
          },
          result: {
            value: [],
            update: ":reducer",
            isResult: true,
          },
          popper: {
            inputs: { array: ":fruits" },
            agent: "popAgent", // returns { array, item }
          },
          reducer: {
            agent: "pushAgent",
            inputs: { array: ":result", item: ":popper.item" },
          },
        },
      },
    },
  },
};

export const graphDataNestedInjection = {
  version: 0.5,
  nodes: {
    source: {
      value: "hello",
    },
    parent: {
      agent: "nestedAgent",
      inputs: { inner_source: ":source" },
      isResult: true,
      graph: {
        loop: {
          count: 10,
        },
        nodes: {
          array: {
            value: [],
            update: ":reducer",
          },
          item: {
            agent: "sleeperAgent",
            params: {
              duration: 10,
              value: ":inner_source",
            },
          },
          reducer: {
            agent: "pushAgent",
            inputs: { array: ":array", item: ":item" },
            isResult: true,
          },
        },
      },
    },
  },
};

// test_fork.ts
export const forkGraph = {
  version: 0.5,
  nodes: {
    source: {
      value: { content: [{ level1: { level2: "hello1" } }, { level1: { level2: "hello2" } }] },
    },
    mapNode: {
      agent: "mapAgent",
      inputs: { rows: ":source.content" },
      graph: {
        version: 0.5,
        nodes: {
          workingMemory: {
            value: {},
          },
          forked: {
            agent: "sleeperAgent",
            inputs: [":row.level1"],
          },
          forked2: {
            agent: "sleeperAgent",
            inputs: [":forked"],
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    bypassAgent: {
      agent: "bypassAgent",
      inputs: [":mapNode"],
    },
  },
};

// test_bypass.ts
export const graphDataBypass = {
  version: 0.5,
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

export const graphDataBypass2 = {
  version: 0.5,
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
        version: 0.5,
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
      params: {
        compositeResult: true,
      },
    },
    bypassAgent2: {
      agent: "bypassAgent",
      inputs: [":mapNode.bypassAgent"],
    },
  },
};

export const graphDataBypass3 = {
  version: 0.5,
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
        version: 0.5,
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
      params: {
        compositeResult: true,
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
export const graphDataBypass4 = {
  version: 0.5,
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
        version: 0.5,
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
      params: {
        compositeResult: true,
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

export const graphDataBypass5 = {
  version: 0.5,
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
