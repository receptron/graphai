
# @graphai/vanilla for GraphAI

Vanilla agents for GraphAI.

### Install

```sh
yarn add @graphai/vanilla
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { 
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  jsonParserAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  arrayFlatAgent,
  arrayJoinAgent,
  dotProductAgent,
  sortByValuesAgent,
  echoAgent,
  bypassAgent,
  countingAgent,
  copyMessageAgent,
  copy2ArrayAgent,
  mergeNodeIdAgent,
  streamMockAgent,
  nestedAgent,
  mapAgent,
  workerAgent,
  totalAgent,
  dataSumTemplateAgent,
  propertyFilterAgent,
  copyAgent,
  vanillaFetchAgent
 } from "@graphai/vanilla";

const agents = { 
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  jsonParserAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  arrayFlatAgent,
  arrayJoinAgent,
  dotProductAgent,
  sortByValuesAgent,
  echoAgent,
  bypassAgent,
  countingAgent,
  copyMessageAgent,
  copy2ArrayAgent,
  mergeNodeIdAgent,
  streamMockAgent,
  nestedAgent,
  mapAgent,
  workerAgent,
  totalAgent,
  dataSumTemplateAgent,
  propertyFilterAgent,
  copyAgent,
  vanillaFetchAgent
 };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Input/Output/Params Schema & samples
 - [stringEmbeddingsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/embedding/stringEmbeddingsAgent.md)
 - [stringSplitterAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringSplitterAgent.md)
 - [stringTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringTemplateAgent.md)
 - [jsonParserAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/jsonParserAgent.md)
 - [pushAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/pushAgent.md)
 - [popAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/popAgent.md)
 - [shiftAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/shiftAgent.md)
 - [arrayFlatAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/arrayFlatAgent.md)
 - [arrayJoinAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/arrayJoinAgent.md)
 - [dotProductAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/matrix/dotProductAgent.md)
 - [sortByValuesAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/matrix/sortByValuesAgent.md)
 - [echoAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/echoAgent.md)
 - [bypassAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/bypassAgent.md)
 - [countingAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/countingAgent.md)
 - [copyMessageAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/copyMessageAgent.md)
 - [copy2ArrayAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/copy2ArrayAgent.md)
 - [mergeNodeIdAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/mergeNodeIdAgent.md)
 - [streamMockAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/streamMockAgent.md)
 - [nestedAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/nestedAgent.md)
 - [mapAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/mapAgent.md)
 - [workerAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/workerAgent.md)
 - [totalAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/totalAgent.md)
 - [dataSumTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/dataSumTemplateAgent.md)
 - [propertyFilterAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/propertyFilterAgent.md)
 - [copyAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/copyAgent.md)
 - [vanillaFetchAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/service/vanillaFetchAgent.md)





### GraphData Example

#### dynamicGraphData
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {
        "version": 0.5,
        "loop": {
          "count": 5
        },
        "nodes": {
          "array": {
            "value": [],
            "update": ":reducer"
          },
          "item": {
            "agent": "sleeperAgent",
            "params": {
              "duration": 10,
              "value": "hello"
            }
          },
          "reducer": {
            "isResult": true,
            "agent": "pushAgent",
            "inputs": {
              "array": ":array",
              "item": ":item"
            }
          }
        }
      }
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":source",
      "isResult": true
    }
  }
}
```

#### dynamicGraphData2
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "{\"version\":0.5,\"loop\":{\"count\":5},\"nodes\":{\"array\":{\"value\":[],\"update\":\":reducer\"},\"item\":{\"agent\":\"sleeperAgent\",\"params\":{\"duration\":10,\"value\":\"hello\"}},\"reducer\":{\"isResult\":true,\"agent\":\"pushAgent\",\"inputs\":{\"array\":\":array\",\"item\":\":item\"}}}}"
    },
    "parser": {
      "agent": "jsonParserAgent",
      "inputs": [
        ":source"
      ]
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":parser",
      "isResult": true
    }
  }
}
```

#### dynamicGraphData3
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "```json\n{\"version\":0.5,\"loop\":{\"count\":5},\"nodes\":{\"array\":{\"value\":[],\"update\":\":reducer\"},\"item\":{\"agent\":\"sleeperAgent\",\"params\":{\"duration\":10,\"value\":\"hello\"}},\"reducer\":{\"isResult\":true,\"agent\":\"pushAgent\",\"inputs\":{\"array\":\":array\",\"item\":\":item\"}}}}\n```\n"
    },
    "parser": {
      "agent": "jsonParserAgent",
      "inputs": [
        ":source"
      ]
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":parser",
      "isResult": true
    }
  }
}
```

#### nestedGraphData
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "Hello World"
    },
    "nestedNode": {
      "agent": "nestedAgent",
      "inputs": {
        "inner0": ":source"
      },
      "isResult": true,
      "graph": {
        "nodes": {
          "result": {
            "agent": "copyAgent",
            "inputs": [
              ":inner0"
            ],
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### nestedGraphData2
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "Hello World"
    },
    "nestedNode": {
      "agent": "nestedAgent",
      "inputs": {
        "source": ":source"
      },
      "isResult": true,
      "graph": {
        "nodes": {
          "result": {
            "agent": "copyAgent",
            "inputs": [
              ":source"
            ],
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### graphDataMap1
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {
        "fruits": [
          "apple",
          "orange",
          "banana",
          "lemon",
          "melon",
          "pineapple",
          "tomato"
        ]
      }
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source.fruits"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node2": {
            "agent": "stringTemplateAgent",
            "params": {
              "template": "I love ${0}."
            },
            "inputs": [
              ":row"
            ],
            "isResult": true
          }
        }
      }
    },
    "result": {
      "agent": "sleeperAgent",
      "inputs": [
        ":nestedNode.node2"
      ],
      "isResult": true
    }
  }
}
```

#### graphDataMap3
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": [
        "hello",
        "hello2"
      ]
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source1"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node1": {
            "agent": "bypassAgent",
            "inputs": [
              ":row"
            ],
            "isResult": true
          }
        }
      }
    },
    "result": {
      "agent": "bypassAgent",
      "inputs": [
        ":nestedNode.node1"
      ],
      "isResult": true
    }
  }
}
```

#### graphDataMap4
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": [
        "hello",
        "hello2"
      ]
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source1"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node1": {
            "agent": "bypassAgent",
            "inputs": [
              ":row"
            ],
            "isResult": true
          }
        }
      }
    },
    "result": {
      "agent": "bypassAgent",
      "params": {
        "flat": 1
      },
      "inputs": [
        ":nestedNode.node1"
      ]
    }
  }
}
```

#### graphDataMap5
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": [
        "hello",
        "hello2"
      ]
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source1"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node1": {
            "agent": "bypassAgent",
            "inputs": [
              ":row"
            ],
            "isResult": true
          }
        }
      }
    },
    "result": {
      "agent": "bypassAgent",
      "params": {
        "flat": 2
      },
      "inputs": [
        ":nestedNode.node1"
      ]
    }
  }
}
```

#### graphDataPush
```json
{
  "version": 0.5,
  "loop": {
    "count": 10
  },
  "nodes": {
    "array": {
      "value": [],
      "update": ":reducer"
    },
    "item": {
      "agent": "sleeperAgent",
      "params": {
        "duration": 10,
        "value": "hello"
      }
    },
    "reducer": {
      "isResult": true,
      "agent": "pushAgent",
      "inputs": {
        "array": ":array",
        "item": ":item"
      }
    }
  }
}
```

#### graphDataPop
```json
{
  "version": 0.5,
  "loop": {
    "while": ":source"
  },
  "nodes": {
    "source": {
      "value": [
        "orange",
        "banana",
        "lemon"
      ],
      "update": ":popper.array"
    },
    "result": {
      "value": [],
      "update": ":reducer"
    },
    "popper": {
      "inputs": {
        "array": ":source"
      },
      "agent": "popAgent"
    },
    "reducer": {
      "agent": "pushAgent",
      "inputs": {
        "array": ":result",
        "item": ":popper.item"
      }
    }
  }
}
```

#### graphDataNested
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "hello"
    },
    "parent": {
      "agent": "nestedAgent",
      "inputs": {
        "source": ":source"
      },
      "isResult": true,
      "graph": {
        "loop": {
          "count": 10
        },
        "nodes": {
          "array": {
            "value": [],
            "update": ":reducer"
          },
          "item": {
            "agent": "sleeperAgent",
            "params": {
              "duration": 10,
              "value": ":source"
            }
          },
          "reducer": {
            "agent": "pushAgent",
            "inputs": {
              "array": ":array",
              "item": ":item"
            },
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### graphDataNestedPop
```json
{
  "version": 0.5,
  "nodes": {
    "fruits": {
      "value": [
        "orange",
        "banana",
        "lemon"
      ]
    },
    "parent": {
      "agent": "nestedAgent",
      "isResult": true,
      "inputs": {
        "fruits": ":fruits"
      },
      "graph": {
        "loop": {
          "while": ":fruits"
        },
        "nodes": {
          "fruits": {
            "value": [],
            "update": ":popper.array"
          },
          "result": {
            "value": [],
            "update": ":reducer",
            "isResult": true
          },
          "popper": {
            "inputs": {
              "array": ":fruits"
            },
            "agent": "popAgent"
          },
          "reducer": {
            "agent": "pushAgent",
            "inputs": {
              "array": ":result",
              "item": ":popper.item"
            }
          }
        }
      }
    }
  }
}
```

#### graphDataNestedInjection
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "hello"
    },
    "parent": {
      "agent": "nestedAgent",
      "inputs": {
        "inner_source": ":source"
      },
      "isResult": true,
      "graph": {
        "loop": {
          "count": 10
        },
        "nodes": {
          "array": {
            "value": [],
            "update": ":reducer"
          },
          "item": {
            "agent": "sleeperAgent",
            "params": {
              "duration": 10,
              "value": ":inner_source"
            }
          },
          "reducer": {
            "agent": "pushAgent",
            "inputs": {
              "array": ":array",
              "item": ":item"
            },
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### forkGraph
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {
        "content": [
          {
            "level1": {
              "level2": "hello1"
            }
          },
          {
            "level1": {
              "level2": "hello2"
            }
          }
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source.content"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "workingMemory": {
            "value": {}
          },
          "forked": {
            "agent": "sleeperAgent",
            "inputs": [
              ":row.level1"
            ]
          },
          "forked2": {
            "agent": "sleeperAgent",
            "inputs": [
              ":forked"
            ],
            "isResult": true
          }
        }
      }
    },
    "bypassAgent": {
      "agent": "bypassAgent",
      "inputs": [
        ":mapNode"
      ]
    }
  }
}
```

#### graphDataBypass
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": "hello"
      }
    },
    "bypassAgent": {
      "agent": "bypassAgent",
      "inputs": [
        ":echo"
      ]
    },
    "bypassAgent2": {
      "agent": "bypassAgent",
      "inputs": [
        ":bypassAgent.$0"
      ]
    }
  }
}
```

#### graphDataBypass2
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": [
          "hello",
          "hello"
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":echo.message"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "bypassAgent": {
            "agent": "bypassAgent",
            "inputs": [
              ":row"
            ],
            "isResult": true,
            "params": {
              "firstElement": true
            }
          }
        }
      }
    },
    "bypassAgent2": {
      "agent": "bypassAgent",
      "inputs": [
        ":mapNode.bypassAgent"
      ]
    }
  }
}
```

#### graphDataBypass3
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": [
          "hello",
          "hello"
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":echo.message"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "bypassAgent": {
            "agent": "bypassAgent",
            "inputs": [
              ":row"
            ]
          },
          "bypassAgent2": {
            "agent": "bypassAgent",
            "inputs": [
              ":bypassAgent.$0"
            ]
          },
          "bypassAgent3": {
            "agent": "bypassAgent",
            "inputs": [
              ":bypassAgent2.$0"
            ],
            "params": {
              "firstElement": true
            },
            "isResult": true
          }
        }
      }
    },
    "bypassAgent4": {
      "agent": "bypassAgent",
      "params": {
        "firstElement": true
      },
      "inputs": [
        ":mapNode.bypassAgent3"
      ]
    }
  }
}
```

#### graphDataBypass4
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": [
          "hello",
          "hello"
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":echo.message"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "bypassAgent": {
            "agent": "bypassAgent",
            "inputs": [
              ":row"
            ]
          },
          "bypassAgent2": {
            "agent": "bypassAgent",
            "inputs": [
              ":bypassAgent.$0",
              ":row"
            ],
            "isResult": true
          }
        }
      }
    },
    "bypassAgent3": {
      "agent": "bypassAgent",
      "inputs": [
        ":mapNode.bypassAgent2"
      ],
      "params": {
        "firstElement": true
      }
    }
  }
}
```

#### graphDataBypass5
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": "hello"
      }
    },
    "bypassAgent": {
      "agent": "bypassAgent",
      "inputs": [
        ":echo",
        ":echo",
        ":echo"
      ]
    },
    "bypassAgent2": {
      "agent": "bypassAgent",
      "inputs": [
        ":bypassAgent",
        ":bypassAgent"
      ]
    },
    "bypassAgent3": {
      "agent": "bypassAgent",
      "inputs": [
        ":bypassAgent2",
        ":bypassAgent2"
      ]
    }
  }
}
```




