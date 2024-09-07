
# @graphai/vanilla for GraphAI

Vanilla agents for GraphAI.

### Install

```sh
yarn add @graphai/vanilla
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, jsonParserAgent, pushAgent, popAgent, shiftAgent, dotProductAgent, sortByValuesAgent, echoAgent, bypassAgent, countingAgent, copyMessageAgent, copy2ArrayAgent, mergeNodeIdAgent, streamMockAgent, nestedAgent, mapAgent, workerAgent, totalAgent, dataSumTemplateAgent, propertyFilterAgent, copyAgent, vanillaFetchAgent } from "@graphai/vanilla";

const agents = { stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, jsonParserAgent, pushAgent, popAgent, shiftAgent, dotProductAgent, sortByValuesAgent, echoAgent, bypassAgent, countingAgent, copyMessageAgent, copy2ArrayAgent, mergeNodeIdAgent, streamMockAgent, nestedAgent, mapAgent, workerAgent, totalAgent, dataSumTemplateAgent, propertyFilterAgent, copyAgent, vanillaFetchAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

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




