
# @graphai/agents for GraphAI

Agents for GraphAI.

### Install

```sh
yarn add @graphai/agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Related Agent Packages
 - [@graphai/data_agents](https://www.npmjs.com/package/@graphai/data_agents)
 - [@graphai/input_agents](https://www.npmjs.com/package/@graphai/input_agents)
 - [@graphai/llm_agents](https://www.npmjs.com/package/@graphai/llm_agents)
 - [@graphai/service_agents](https://www.npmjs.com/package/@graphai/service_agents)
 - [@graphai/sleeper_agents](https://www.npmjs.com/package/@graphai/sleeper_agents)
 - [@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)

### GraphData Example

#### graphDataLiteral
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "apple"
    },
    "source2": {
      "value": {
        "apple": "red"
      }
    },
    "step1": {
      "agent": "stringTemplateAgent",
      "params": {
        "template": "${a}, ${b}, ${c}."
      },
      "inputs": {
        "a": ":source",
        "b": "orange"
      },
      "isResult": true
    },
    "step2": {
      "agent": "sleepAndMergeAgent",
      "inputs": {
        "array": [
          ":source2",
          {
            "lemon": "yellow"
          }
        ]
      },
      "isResult": true
    }
  }
}
```

#### graphDataInputs
```json
{
  "version": 0.5,
  "nodes": {
    "apple": {
      "value": {
        "fruits": {
          "apple": "red"
        }
      }
    },
    "lemon": {
      "value": {
        "fruits": {
          "lemon": "yellow"
        }
      }
    },
    "total": {
      "agent": "sleepAndMergeAgent",
      "inputs": {
        "array": [
          ":apple",
          ":lemon",
          ":apple.fruits",
          ":lemon.fruits"
        ]
      }
    }
  }
}
```

#### graphDataAny
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {}
    },
    "positive": {
      "agent": "sleepAndMergeAgent",
      "anyInput": true,
      "isResult": true,
      "inputs": {
        "array": [
          ":source.yes"
        ]
      }
    },
    "negative": {
      "agent": "sleepAndMergeAgent",
      "anyInput": true,
      "isResult": true,
      "inputs": {
        "array": [
          ":source.no"
        ]
      }
    }
  }
}
```

#### graphDataAny2
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": {
        "apple": "red"
      }
    },
    "source2": {
      "value": {
        "lemon": "yellow"
      }
    },
    "router1": {
      "agent": "sleepAndMergeAgent",
      "params": {
        "duration": 10
      },
      "isResult": true,
      "inputs": {
        "array": [
          ":source1"
        ]
      }
    },
    "router2": {
      "agent": "sleepAndMergeAgent",
      "params": {
        "duration": 100
      },
      "isResult": true,
      "inputs": {
        "array": [
          ":source2"
        ]
      }
    },
    "receiver": {
      "agent": "sleepAndMergeAgent",
      "anyInput": true,
      "isResult": true,
      "inputs": {
        "array": [
          ":router1",
          ":router2"
        ]
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
      "value": {
        "nodes": {
          "source": {
            "value": 1
          },
          "result": {
            "agent": "copyAgent",
            "inputs": {
              "source": ":source"
            },
            "isResult": true
          }
        }
      }
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":source",
      "isResult": true
    },
    "catch": {
      "agent": "propertyFilterAgent",
      "params": {
        "include": [
          "message"
        ]
      },
      "if": ":nested.onError",
      "inputs": {
        "item": ":nested.onError"
      },
      "isResult": true
    }
  }
}
```




