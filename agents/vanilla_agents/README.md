
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
  arrayFlatAgent,
  arrayJoinAgent,
  bypassAgent,
  copy2ArrayAgent,
  copyAgent,
  copyMessageAgent,
  countingAgent,
  dataSumTemplateAgent,
  dotProductAgent,
  echoAgent,
  jsonParserAgent,
  mapAgent,
  mergeNodeIdAgent,
  nestedAgent,
  popAgent,
  propertyFilterAgent,
  pushAgent,
  shiftAgent,
  sortByValuesAgent,
  streamMockAgent,
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  totalAgent,
  vanillaFetchAgent,
  workerAgent
 } from "@graphai/vanilla";

const agents = { 
  arrayFlatAgent,
  arrayJoinAgent,
  bypassAgent,
  copy2ArrayAgent,
  copyAgent,
  copyMessageAgent,
  countingAgent,
  dataSumTemplateAgent,
  dotProductAgent,
  echoAgent,
  jsonParserAgent,
  mapAgent,
  mergeNodeIdAgent,
  nestedAgent,
  popAgent,
  propertyFilterAgent,
  pushAgent,
  shiftAgent,
  sortByValuesAgent,
  streamMockAgent,
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  totalAgent,
  vanillaFetchAgent,
  workerAgent
 };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- arrayFlatAgent - Array Flat Agent
- arrayJoinAgent - Array Join Agent
- bypassAgent - bypass agent
- copy2ArrayAgent - Copy2Array agent
- copyAgent - Returns namedInputs
- copyMessageAgent - CopyMessage agent
- countingAgent - Counting agent
- dataSumTemplateAgent - Returns the sum of input values
- dotProductAgent - dotProduct Agent
- echoAgent - Echo agent
- jsonParserAgent - Template agent
- mapAgent - Map Agent
- mergeNodeIdAgent - merge node id agent
- nestedAgent - nested Agent
- popAgent - Pop Agent
- propertyFilterAgent - Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'
- pushAgent - push Agent
- shiftAgent - shift Agent
- sortByValuesAgent - sortByValues Agent
- streamMockAgent - Stream mock agent
- stringEmbeddingsAgent - Embeddings Agent
- stringSplitterAgent - This agent strip one long string into chunks using following parameters
- stringTemplateAgent - Template agent
- totalAgent - Returns the sum of input values
- vanillaFetchAgent - Retrieves JSON data from the specified URL
- workerAgent - Map Agent

### Input/Output/Params Schema & samples
 - [arrayFlatAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/arrayFlatAgent.md)
 - [arrayJoinAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/arrayJoinAgent.md)
 - [bypassAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/bypassAgent.md)
 - [copy2ArrayAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/copy2ArrayAgent.md)
 - [copyAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/copyAgent.md)
 - [copyMessageAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/copyMessageAgent.md)
 - [countingAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/countingAgent.md)
 - [dataSumTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/dataSumTemplateAgent.md)
 - [dotProductAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/matrix/dotProductAgent.md)
 - [echoAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/echoAgent.md)
 - [jsonParserAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/jsonParserAgent.md)
 - [mapAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/mapAgent.md)
 - [mergeNodeIdAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/mergeNodeIdAgent.md)
 - [nestedAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/nestedAgent.md)
 - [popAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/popAgent.md)
 - [propertyFilterAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/propertyFilterAgent.md)
 - [pushAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/pushAgent.md)
 - [shiftAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/shiftAgent.md)
 - [sortByValuesAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/matrix/sortByValuesAgent.md)
 - [streamMockAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/streamMockAgent.md)
 - [stringEmbeddingsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/embedding/stringEmbeddingsAgent.md)
 - [stringSplitterAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringSplitterAgent.md)
 - [stringTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringTemplateAgent.md)
 - [totalAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/totalAgent.md)
 - [vanillaFetchAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/service/vanillaFetchAgent.md)
 - [workerAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/workerAgent.md)





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
      "inputs": {
        "text": ":source"
      }
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
      "inputs": {
        "text": ":source"
      }
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
            "inputs": {
              "text": ":inner0"
            },
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
            "inputs": {
              "text": ":source"
            },
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
              "template": "I love ${m}."
            },
            "inputs": {
              "m": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "sleeperAgent",
      "inputs": {
        "array": [
          ":nestedNode.node2"
        ]
      },
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
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "result"
      },
      "inputs": {
        "result": [
          ":nestedNode.node1"
        ]
      },
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
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "result"
      },
      "inputs": {
        "result": ":nestedNode.node1"
      }
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
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "bypassAgent",
      "params": {
        "flat": 2,
        "namedKey": "res"
      },
      "inputs": {
        "res": ":nestedNode.node1"
      }
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
            "inputs": {
              "array": [
                ":row.level1"
              ]
            }
          },
          "forked2": {
            "agent": "sleeperAgent",
            "inputs": {
              "array": [
                ":forked"
              ]
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "bypassAgent": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "result"
      },
      "inputs": {
        "result": [
          ":mapNode"
        ]
      }
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
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": [
          ":echo"
        ]
      }
    },
    "bypassAgent2": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": [
          ":bypassAgent.$0"
        ]
      }
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
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "bypassAgent2": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":mapNode.bypassAgent"
        ]
      }
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
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": [
                ":row"
              ]
            }
          },
          "bypassAgent2": {
            "agent": "bypassAgent",
            "params": {
              "namedKey": "text"
            },
            "inputs": {
              "text": ":bypassAgent"
            }
          },
          "bypassAgent3": {
            "agent": "bypassAgent",
            "params": {
              "namedKey": "text"
            },
            "inputs": {
              "text": ":bypassAgent2.$0"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "bypassAgent4": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": ":mapNode.bypassAgent3"
      }
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
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            }
          },
          "bypassAgent2": {
            "agent": "bypassAgent",
            "params": {
              "namedKey": "array"
            },
            "inputs": {
              "array": [
                ":bypassAgent",
                ":row"
              ]
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "bypassAgent3": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": ":mapNode.bypassAgent2"
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
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":echo",
          ":echo",
          ":echo"
        ]
      }
    },
    "bypassAgent2": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":bypassAgent",
          ":bypassAgent"
        ]
      }
    },
    "bypassAgent3": {
      "agent": "bypassAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":bypassAgent2",
          ":bypassAgent2"
        ]
      }
    }
  }
}
```




