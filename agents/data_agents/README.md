
# @graphai/data_agents for GraphAI

Data agents for GraphAI.

### Install

```sh
yarn add @graphai/data_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { dataObjectMergeTemplateAgent } from "@graphai/data_agents";

const agents = { dataObjectMergeTemplateAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- dataObjectMergeTemplateAgent - Merge object

### Input/Output/Params Schema & samples
 - [dataObjectMergeTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/dataObjectMergeTemplateAgent.md)

### Input/Params example
 - dataObjectMergeTemplateAgent

```typescript
{
  "inputs": {
    "array": [
      {
        "content1": "hello"
      },
      {
        "content2": "test"
      }
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "content1": "hello"
      }
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "content": "hello1"
      },
      {
        "content": "hello2"
      }
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1,
        "b": 1
      },
      {
        "a": 2,
        "b": 2
      },
      {
        "a": 3,
        "b": 0,
        "c": 5
      }
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": {
          "b": {
            "c": {
              "d": "e"
            }
          }
        }
      },
      {
        "b": {
          "c": {
            "d": {
              "e": "f"
            }
          }
        }
      },
      {
        "b": {
          "d": {
            "e": {
              "f": "g"
            }
          }
        }
      }
    ]
  },
  "params": {}
}
```










