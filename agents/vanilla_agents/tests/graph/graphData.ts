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
      inputs: [":source"],
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
      inputs: [":source"],
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
            inputs: [":inner0"],
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
            inputs: [":source"],
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
              template: "I love ${0}.",
            },
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "sleeperAgent",
      inputs: [":nestedNode.node2"],
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
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "bypassAgent",
      inputs: [":nestedNode.node1"],
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
            inputs: [":row"],
            isResult: true,
          },
        },
      },
    },
    result: {
      agent: "bypassAgent",
      params: {
        flat: 1,
      },
      inputs: [":nestedNode.node1"],
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
            inputs: [":row"],
            isResult: true,
          },
        },
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
