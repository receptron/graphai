
# @graphai/service_agents for GraphAI

Service agents for GraphAI.

### Install

```sh
yarn add @graphai/service_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { fetchAgent, wikipediaAgent } from "@graphai/service_agents";

const agents = { fetchAgent, wikipediaAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- fetchAgent - Retrieves JSON data from the specified URL
- wikipediaAgent - Retrieves data from wikipedia

### Input/Output/Params Schema & samples
 - [fetchAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/service/fetchAgent.md)
 - [wikipediaAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/service/wikipediaAgent.md)

### Input/Params example
 - fetchAgent

```typescript
{
  "inputs": {
    "url": "https://www.google.com",
    "queryParams": {
      "foo": "bar"
    },
    "headers": {
      "x-myHeader": "secret"
    }
  },
  "params": {
    "debug": true
  }
}
```


```typescript
{
  "inputs": {
    "url": "https://www.google.com",
    "body": {
      "foo": "bar"
    }
  },
  "params": {
    "debug": true
  }
}
```

 - wikipediaAgent

```typescript
{
  "inputs": {
    "query": "steve jobs"
  },
  "params": {
    "lang": "ja"
  }
}
```






### GraphData Example

#### graphDataFetch
```json
{
  "version": 0.5,
  "nodes": {
    "url": {
      "value": "https://www.google.com/search?q=hello"
    },
    "fetch": {
      "agent": "fetchAgent",
      "params": {
        "type": "text"
      },
      "inputs": {
        "url": ":url"
      }
    },
    "success": {
      "agent": "copyAgent",
      "isResult": true,
      "unless": ":fetch.onError",
      "inputs": {
        "result": true
      }
    },
    "error": {
      "agent": "copyAgent",
      "isResult": true,
      "if": ":fetch.onError",
      "inputs": {
        "error": ":fetch.onError"
      }
    }
  }
}
```

#### graphDataPost
```json
{
  "version": 0.5,
  "nodes": {
    "url": {
      "value": "https://www.google.com/search?q=hello"
    },
    "fetch": {
      "agent": "fetchAgent",
      "params": {
        "type": "text"
      },
      "inputs": {
        "url": ":url",
        "body": "Posting data"
      }
    },
    "success": {
      "agent": "copyAgent",
      "isResult": true,
      "unless": ":fetch.onError",
      "inputs": {
        "result": true
      }
    },
    "error": {
      "agent": "propertyFilterAgent",
      "params": {
        "include": [
          "message",
          "status"
        ]
      },
      "isResult": true,
      "if": ":fetch.onError",
      "inputs": {
        "item": ":fetch.onError"
      }
    }
  }
}
```




