// for test_dynamic_graph

const graphdata_child = {
  version: 0.5,
  loop: {
    count: 5,
  },
  nodes: {
    array: {
      value: [],
      update: ":reducer.array",
    },
    item: {
      agent: "sleepAndMergeAgent",
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
          resultInner: {
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

export const nestedGraphDataError = {
  version: 0.5,
  nodes: {
    source: {
      value: "Hello World",
    },
    nestedNode: {
      agent: "nestedAgent",
      inputs: { source: ":source" },
      params: {
        throwError: true,
      },
      isResult: true,
      graph: {
        nodes: {
          result: {
            agent: "copyAgent",
            inputs: { text: ":soi_source" },
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
      agent: "sleepAndMergeAgent",
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
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: ":row" },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "copyAgent",
      params: { namedKey: "result" },
      inputs: { result: [":nestedNode.node1"] },
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
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: ":row" },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "copyAgent",
      params: {
        namedKey: "result",
      },
      inputs: { result: ":nestedNode.node1" },
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
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: ":row" },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    result: {
      agent: "copyAgent",
      params: {
        flat: 2,
        namedKey: "res",
      },
      inputs: { res: ":nestedNode.node1" },
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
      update: ":reducer.array",
    },
    item: {
      agent: "sleepAndMergeAgent",
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
      update: ":reducer.array",
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
            update: ":reducer.array",
          },
          item: {
            agent: "sleepAndMergeAgent",
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
            update: ":reducer.array",
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
            update: ":reducer.array",
          },
          item: {
            agent: "sleepAndMergeAgent",
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
            agent: "sleepAndMergeAgent",
            inputs: { array: [":row.level1"] },
          },
          forked2: {
            agent: "sleepAndMergeAgent",
            inputs: { array: [":forked"] },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "result" },
      inputs: { result: [":mapNode"] },
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
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: [":echo"] },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: [":copyAgent.$0"] },
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
          copyAgent: {
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: ":row" },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "array" },
      inputs: { array: [":mapNode.copyAgent"] },
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
          copyAgent: {
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: [":row"] },
          },
          copyAgent2: {
            agent: "copyAgent",
            params: { namedKey: "text" },
            inputs: { text: ":copyAgent" },
          },
          copyAgent3: {
            agent: "copyAgent",
            params: { namedKey: "text" },
            inputs: { text: ":copyAgent2.$0" },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    copyAgent4: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":mapNode.copyAgent3" },
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
          copyAgent: {
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: ":row" },
          },
          copyAgent2: {
            agent: "copyAgent",
            params: { namedKey: "array" },
            inputs: { array: [":copyAgent", ":row"] },
            isResult: true,
          },
        },
      },
      params: {
        compositeResult: true,
      },
    },
    copyAgent3: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":mapNode.copyAgent2" },
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
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "array" },
      inputs: { array: [":echo", ":echo", ":echo"] },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "array" },
      inputs: { array: [":copyAgent", ":copyAgent"] },
    },
    copyAgent3: {
      agent: "copyAgent",
      params: { namedKey: "array" },
      inputs: { array: [":copyAgent2", ":copyAgent2"] },
    },
  },
};
