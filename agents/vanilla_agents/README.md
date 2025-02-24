
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
  compareAgent,
  copy2ArrayAgent,
  copyAgent,
  copyMessageAgent,
  countingAgent,
  dataSumTemplateAgent,
  dotProductAgent,
  echoAgent,
  images2messageAgent,
  jsonParserAgent,
  mapAgent,
  mergeNodeIdAgent,
  nestedAgent,
  popAgent,
  propertyFilterAgent,
  pushAgent,
  shiftAgent,
  sleeperAgent,
  sortByValuesAgent,
  streamMockAgent,
  stringCaseVariantsAgent,
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  stringUpdateTextAgent,
  totalAgent,
  vanillaFetchAgent
 } from "@graphai/vanilla";

const agents = { 
  arrayFlatAgent,
  arrayJoinAgent,
  compareAgent,
  copy2ArrayAgent,
  copyAgent,
  copyMessageAgent,
  countingAgent,
  dataSumTemplateAgent,
  dotProductAgent,
  echoAgent,
  images2messageAgent,
  jsonParserAgent,
  mapAgent,
  mergeNodeIdAgent,
  nestedAgent,
  popAgent,
  propertyFilterAgent,
  pushAgent,
  shiftAgent,
  sleeperAgent,
  sortByValuesAgent,
  streamMockAgent,
  stringCaseVariantsAgent,
  stringEmbeddingsAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  stringUpdateTextAgent,
  totalAgent,
  vanillaFetchAgent
 };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- arrayFlatAgent - Array Flat Agent
- arrayJoinAgent - Array Join Agent
- compareAgent - compare
- copy2ArrayAgent - Copy2Array agent
- copyAgent - Returns namedInputs
- copyMessageAgent - CopyMessage agent
- countingAgent - Counting agent
- dataSumTemplateAgent - Returns the sum of input values
- dotProductAgent - dotProduct Agent
- echoAgent - Echo agent
- images2messageAgent - Returns the message data for llm include image
- jsonParserAgent - Template agent
- mapAgent - Map Agent
- mergeNodeIdAgent - merge node id agent
- nestedAgent - nested Agent
- popAgent - Pop Agent
- propertyFilterAgent - Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'
- pushAgent - push Agent
- shiftAgent - shift Agent
- sleeperAgent - sleeper Agent
- sortByValuesAgent - sortByValues Agent
- streamMockAgent - Stream mock agent
- stringCaseVariantsAgent - Format String Cases agent
- stringEmbeddingsAgent - Embeddings Agent
- stringSplitterAgent - This agent strip one long string into chunks using following parameters
- stringTemplateAgent - Template agent
- stringUpdateTextAgent - 
- totalAgent - Returns the sum of input values
- vanillaFetchAgent - Retrieves JSON data from the specified URL

### Input/Output/Params Schema & samples
 - [arrayFlatAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/arrayFlatAgent.md)
 - [arrayJoinAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/arrayJoinAgent.md)
 - [compareAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/compare/compareAgent.md)
 - [copy2ArrayAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/copy2ArrayAgent.md)
 - [copyAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/copyAgent.md)
 - [copyMessageAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/copyMessageAgent.md)
 - [countingAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/countingAgent.md)
 - [dataSumTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/dataSumTemplateAgent.md)
 - [dotProductAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/matrix/dotProductAgent.md)
 - [echoAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/echoAgent.md)
 - [images2messageAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/image/images2messageAgent.md)
 - [jsonParserAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/jsonParserAgent.md)
 - [mapAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/mapAgent.md)
 - [mergeNodeIdAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/mergeNodeIdAgent.md)
 - [nestedAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/graph/nestedAgent.md)
 - [popAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/popAgent.md)
 - [propertyFilterAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/propertyFilterAgent.md)
 - [pushAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/pushAgent.md)
 - [shiftAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/array/shiftAgent.md)
 - [sleeperAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/sleeper/sleeperAgent.md)
 - [sortByValuesAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/matrix/sortByValuesAgent.md)
 - [streamMockAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/test/streamMockAgent.md)
 - [stringCaseVariantsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringCaseVariantsAgent.md)
 - [stringEmbeddingsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/embedding/stringEmbeddingsAgent.md)
 - [stringSplitterAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringSplitterAgent.md)
 - [stringTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/string/stringTemplateAgent.md)
 - [stringUpdateTextAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/undefined/stringUpdateTextAgent.md)
 - [totalAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/totalAgent.md)
 - [vanillaFetchAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/service/vanillaFetchAgent.md)

### Input/Params example
 - arrayFlatAgent

```typescript
{
  "inputs": {
    "array": [
      [
        1
      ],
      [
        2
      ],
      [
        3
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        1
      ],
      [
        2
      ],
      [
        [
          3
        ]
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        1
      ],
      [
        2
      ],
      [
        [
          3
        ]
      ]
    ]
  },
  "params": {
    "depth": 2
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        "a"
      ],
      [
        "b"
      ],
      [
        "c"
      ]
    ]
  },
  "params": {}
}
```

 - arrayJoinAgent

```typescript
{
  "inputs": {
    "array": [
      [
        1
      ],
      [
        2
      ],
      [
        3
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        1
      ],
      [
        2
      ],
      [
        [
          3
        ]
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        "a"
      ],
      [
        "b"
      ],
      [
        "c"
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        1
      ],
      [
        2
      ],
      [
        3
      ]
    ]
  },
  "params": {
    "separator": "|"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        [
          1
        ]
      ],
      [
        [
          2
        ],
        [
          3
        ]
      ]
    ]
  },
  "params": {
    "separator": "|"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        [
          1
        ]
      ],
      [
        [
          2
        ],
        [
          3
        ]
      ]
    ]
  },
  "params": {
    "separator": "|",
    "flat": 1
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        [
          [
            1
          ]
        ],
        [
          [
            2
          ],
          [
            3
          ]
        ]
      ]
    ]
  },
  "params": {
    "separator": "|",
    "flat": 1
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        [
          [
            1
          ]
        ],
        [
          [
            2
          ],
          [
            3
          ]
        ]
      ]
    ]
  },
  "params": {
    "separator": "|",
    "flat": 2
  }
}
```

 - compareAgent

```typescript
{
  "inputs": {
    "array": [
      "abc",
      "==",
      "abc"
    ]
  },
  "params": {
    "value": {
      "true": "a",
      "false": "b"
    }
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "abc",
      "==",
      "abca"
    ]
  },
  "params": {
    "value": {
      "true": "a",
      "false": "b"
    }
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "abc",
      "==",
      "abc"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "abc",
      "==",
      "abcd"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "abc",
      "!=",
      "abc"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "abc",
      "!=",
      "abcd"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      ">",
      "5"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      ">",
      "15"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      ">",
      5
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      ">",
      15
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      ">=",
      "5"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      ">=",
      "10"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      ">=",
      "19"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      ">=",
      5
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      ">=",
      10
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      ">=",
      19
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      "<",
      "5"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      "<",
      "15"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      "<",
      5
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      "<",
      15
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      "<=",
      "5"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      "<=",
      "10"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "10",
      "<=",
      "19"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      "<=",
      5
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      "<=",
      10
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      10,
      "<=",
      19
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      true,
      "||",
      false
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      false,
      "||",
      false
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      true,
      "&&",
      false
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      true,
      "&&",
      true
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      true,
      "XOR",
      false
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      false,
      "XOR",
      true
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      false,
      "XOR",
      false
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      true,
      "XOR",
      true
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        "aaa",
        "==",
        "aaa"
      ],
      "||",
      [
        "aaa",
        "==",
        "bbb"
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        "aaa",
        "==",
        "aaa"
      ],
      "&&",
      [
        "aaa",
        "==",
        "bbb"
      ]
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        [
          "aaa",
          "==",
          "aaa"
        ],
        "&&",
        [
          "bbb",
          "==",
          "bbb"
        ]
      ],
      "||",
      [
        "aaa",
        "&&",
        "bbb"
      ]
    ]
  },
  "params": {}
}
```

 - copy2ArrayAgent

```typescript
{
  "inputs": {
    "item": {
      "message": "hello"
    }
  },
  "params": {
    "count": 10
  }
}
```


```typescript
{
  "inputs": {
    "message": "hello"
  },
  "params": {
    "count": 10
  }
}
```


```typescript
{
  "inputs": {
    "item": "hello"
  },
  "params": {
    "count": 10
  }
}
```

 - copyAgent

```typescript
{
  "inputs": {
    "color": "red",
    "model": "Model 3"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "Hello World",
      "Discarded"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "color": "red",
    "model": "Model 3"
  },
  "params": {
    "namedKey": "color"
  }
}
```

 - copyMessageAgent

```typescript
{
  "inputs": {},
  "params": {
    "count": 4,
    "message": "hello"
  }
}
```

 - countingAgent

```typescript
{
  "inputs": {},
  "params": {
    "count": 4
  }
}
```

 - dataSumTemplateAgent

```typescript
{
  "inputs": {
    "array": [
      1
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      1,
      2
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      1,
      2,
      3
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      1
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      1,
      2
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      1,
      2,
      3
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```

 - dotProductAgent

```typescript
{
  "inputs": {
    "matrix": [
      [
        1,
        2
      ],
      [
        3,
        4
      ],
      [
        5,
        6
      ]
    ],
    "vector": [
      3,
      2
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "matrix": [
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "vector": [
      1,
      2
    ]
  },
  "params": {}
}
```

 - echoAgent

```typescript
{
  "inputs": {},
  "params": {
    "text": "this is test"
  }
}
```


```typescript
{
  "inputs": {},
  "params": {
    "text": "If you add filterParams option, it will respond to filterParams",
    "filterParams": true
  }
}
```

 - images2messageAgent

```typescript
{
  "inputs": {
    "array": [
      "abcabc",
      "122123"
    ]
  },
  "params": {
    "imageType": "png"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "abcabc",
      "122123"
    ],
    "prompt": "hello"
  },
  "params": {
    "imageType": "jpg",
    "detail": "high"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "http://example.com/1.jpg",
      "http://example.com/2.jpg"
    ]
  },
  "params": {
    "imageType": "http"
  }
}
```

 - jsonParserAgent

```typescript
{
  "inputs": {
    "data": {
      "apple": "red",
      "lemon": "yellow"
    }
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "text": "{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "text": "```\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "text": "```json\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "text": "```JSON\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
  },
  "params": {}
}
```

 - mapAgent

```typescript
{
  "inputs": {
    "rows": [
      1,
      2
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "rows": [
      "apple",
      "orange",
      "banana",
      "lemon",
      "melon",
      "pineapple",
      "tomato"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "rows": [
      {
        "fruit": "apple"
      },
      {
        "fruit": "orange"
      }
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "rows": [
      {
        "fruit": "apple"
      },
      {
        "fruit": "orange"
      }
    ],
    "name": "You",
    "verb": "like"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "rows": [
      1,
      2
    ]
  },
  "params": {
    "resultAll": true
  }
}
```


```typescript
{
  "inputs": {
    "rows": [
      1,
      2
    ]
  },
  "params": {
    "resultAll": true
  }
}
```


```typescript
{
  "inputs": {
    "rows": [
      1,
      2
    ]
  },
  "params": {
    "compositeResult": true
  }
}
```


```typescript
{
  "inputs": {
    "rows": [
      "apple",
      "orange",
      "banana",
      "lemon",
      "melon",
      "pineapple",
      "tomato"
    ]
  },
  "params": {
    "compositeResult": true
  }
}
```


```typescript
{
  "inputs": {
    "rows": [
      1,
      2
    ]
  },
  "params": {
    "resultAll": true,
    "compositeResult": true
  }
}
```


```typescript
{
  "inputs": {
    "rows": [
      1,
      2
    ]
  },
  "params": {
    "resultAll": true,
    "compositeResult": true
  }
}
```

 - mergeNodeIdAgent

```typescript
{
  "inputs": {
    "array": [
      {
        "message": "hello"
      }
    ]
  },
  "params": {}
}
```

 - nestedAgent

```typescript
{
  "inputs": {
    "message": "hello"
  },
  "params": {}
}
```

 - popAgent

```typescript
{
  "inputs": {
    "array": [
      1,
      2,
      3
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "a",
      "b",
      "c"
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      1,
      2,
      3
    ],
    "array2": [
      "a",
      "b",
      "c"
    ]
  },
  "params": {}
}
```

 - propertyFilterAgent

```typescript
{
  "inputs": {
    "array": [
      {
        "color": "red",
        "model": "Model 3",
        "type": "EV",
        "maker": "Tesla",
        "range": 300
      }
    ]
  },
  "params": {
    "include": [
      "color",
      "model"
    ]
  }
}
```


```typescript
{
  "inputs": {
    "item": {
      "color": "red",
      "model": "Model 3",
      "type": "EV",
      "maker": "Tesla",
      "range": 300
    }
  },
  "params": {
    "include": [
      "color",
      "model"
    ]
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "include": [
      "color",
      "model"
    ]
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "exclude": [
      "color",
      "model"
    ]
  }
}
```


```typescript
{
  "inputs": {
    "item": {
      "color": "red",
      "model": "Model 3",
      "type": "EV",
      "maker": "Tesla",
      "range": 300
    }
  },
  "params": {
    "exclude": [
      "color",
      "model"
    ]
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "alter": {
      "color": {
        "red": "blue",
        "blue": "red"
      }
    }
  }
}
```


```typescript
{
  "inputs": {
    "item": {
      "color": "red",
      "model": "Model 3",
      "type": "EV",
      "maker": "Tesla",
      "range": 300
    }
  },
  "params": {
    "alter": {
      "color": {
        "red": "blue",
        "blue": "red"
      }
    }
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "swap": {
      "maker": "model"
    }
  }
}
```


```typescript
{
  "inputs": {
    "item": {
      "color": "red",
      "model": "Model 3",
      "type": "EV",
      "maker": "Tesla",
      "range": 300
    }
  },
  "params": {
    "swap": {
      "maker": "model"
    }
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "inject": [
      {
        "propId": "maker",
        "from": 1
      }
    ]
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "inject": [
      {
        "propId": "maker",
        "from": 1,
        "index": 0
      }
    ]
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "color": "red",
          "model": "Model 3",
          "type": "EV",
          "maker": "Tesla",
          "range": 300
        },
        {
          "color": "blue",
          "model": "Model Y",
          "type": "EV",
          "maker": "Tesla",
          "range": 400
        }
      ],
      "Tesla Motors"
    ]
  },
  "params": {
    "inspect": [
      {
        "propId": "isTesla",
        "equal": "Tesla Motors"
      },
      {
        "propId": "isGM",
        "notEqual": "Tesla Motors",
        "from": 1
      }
    ]
  }
}
```

 - pushAgent

```typescript
{
  "inputs": {
    "array": [
      1,
      2
    ],
    "item": 3
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "apple": 1
      }
    ],
    "item": {
      "lemon": 2
    }
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "apple": 1
      }
    ],
    "items": [
      {
        "lemon": 2
      },
      {
        "banana": 3
      }
    ]
  },
  "params": {}
}
```

 - shiftAgent

```typescript
{
  "inputs": {
    "array": [
      1,
      2,
      3
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "a",
      "b",
      "c"
    ]
  },
  "params": {}
}
```

 - sleeperAgent

```typescript
{
  "inputs": {},
  "params": {
    "duration": 1
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "b": 2
      }
    ]
  },
  "params": {
    "duration": 1
  }
}
```

 - sortByValuesAgent

```typescript
{
  "inputs": {
    "array": [
      "banana",
      "orange",
      "lemon",
      "apple"
    ],
    "values": [
      2,
      5,
      6,
      4
    ]
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "array": [
      "banana",
      "orange",
      "lemon",
      "apple"
    ],
    "values": [
      2,
      5,
      6,
      4
    ]
  },
  "params": {
    "assendant": true
  }
}
```

 - streamMockAgent

```typescript
{
  "inputs": {},
  "params": {
    "message": "this is params test"
  }
}
```


```typescript
{
  "inputs": {
    "message": "this is named inputs test"
  },
  "params": {}
}
```

 - stringCaseVariantsAgent

```typescript
{
  "inputs": {
    "text": "this is a pen"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "text": "string case variants"
  },
  "params": {
    "suffix": "agent"
  }
}
```

 - stringSplitterAgent

```typescript
{
  "inputs": {
    "text": "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do."
  },
  "params": {
    "chunkSize": 64
  }
}
```

 - stringTemplateAgent

```typescript
{
  "inputs": {
    "message1": "hello",
    "message2": "test"
  },
  "params": {
    "template": "${message1}: ${message2}"
  }
}
```


```typescript
{
  "inputs": {
    "message1": "hello",
    "message2": "test"
  },
  "params": {
    "template": [
      "${message1}: ${message2}",
      "${message2}: ${message1}"
    ]
  }
}
```


```typescript
{
  "inputs": {
    "message1": "hello",
    "message2": "test"
  },
  "params": {
    "template": {
      "apple": "${message1}",
      "lemon": "${message2}"
    }
  }
}
```


```typescript
{
  "inputs": {
    "message1": "hello",
    "message2": "test"
  },
  "params": {
    "template": [
      {
        "apple": "${message1}",
        "lemon": "${message2}"
      }
    ]
  }
}
```


```typescript
{
  "inputs": {
    "message1": "hello",
    "message2": "test"
  },
  "params": {
    "template": {
      "apple": "${message1}",
      "lemon": [
        "${message2}"
      ]
    }
  }
}
```


```typescript
{
  "inputs": {
    "agent": "openAiAgent",
    "row": "hello world",
    "params": {
      "text": "message"
    }
  },
  "params": {
    "template": {
      "version": 0.5,
      "nodes": {
        "ai": {
          "agent": "${agent}",
          "isResult": true,
          "params": "${params}",
          "inputs": {
            "prompt": "${row}"
          }
        }
      }
    }
  }
}
```

 - stringUpdateTextAgent

```typescript
{
  "inputs": {
    "newText": "new",
    "oldText": "old"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {
    "newText": "",
    "oldText": "old"
  },
  "params": {}
}
```


```typescript
{
  "inputs": {},
  "params": {}
}
```


```typescript
{
  "inputs": {
    "oldText": "old"
  },
  "params": {}
}
```

 - totalAgent

```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "a": 2
      },
      {
        "a": 3
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
      [
        {
          "a": 1,
          "b": -1
        },
        {
          "c": 10
        }
      ],
      [
        {
          "a": 2,
          "b": -1
        }
      ],
      [
        {
          "a": 3,
          "b": -2
        },
        {
          "d": -10
        }
      ]
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
        "a": 1
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
        "a": 1
      },
      {
        "a": 2
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
        "a": 1
      },
      {
        "a": 2
      },
      {
        "a": 3
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
        "b": 0
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
        "a": 1
      },
      {
        "a": 2,
        "b": 2
      },
      {
        "a": 3,
        "b": 0
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
        "a": 1
      },
      {
        "a": 2
      },
      {
        "a": 3
      }
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      [
        {
          "a": 1,
          "b": -1
        },
        {
          "c": 10
        }
      ],
      [
        {
          "a": 2,
          "b": -1
        }
      ],
      [
        {
          "a": 3,
          "b": -2
        },
        {
          "d": -10
        }
      ]
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      }
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "a": 2
      }
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "a": 2
      },
      {
        "a": 3
      }
    ]
  },
  "params": {
    "flatResponse": true
  }
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
        "b": 0
      }
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "a": 2,
        "b": 2
      },
      {
        "a": 3,
        "b": 0
      }
    ]
  },
  "params": {
    "flatResponse": true
  }
}
```

 - vanillaFetchAgent

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
            "update": ":reducer.array"
          },
          "item": {
            "agent": "sleepAndMergeAgent",
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
      "value": "{\"version\":0.5,\"loop\":{\"count\":5},\"nodes\":{\"array\":{\"value\":[],\"update\":\":reducer.array\"},\"item\":{\"agent\":\"sleepAndMergeAgent\",\"params\":{\"duration\":10,\"value\":\"hello\"}},\"reducer\":{\"isResult\":true,\"agent\":\"pushAgent\",\"inputs\":{\"array\":\":array\",\"item\":\":item\"}}}}"
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
      "value": "```json\n{\"version\":0.5,\"loop\":{\"count\":5},\"nodes\":{\"array\":{\"value\":[],\"update\":\":reducer.array\"},\"item\":{\"agent\":\"sleepAndMergeAgent\",\"params\":{\"duration\":10,\"value\":\"hello\"}},\"reducer\":{\"isResult\":true,\"agent\":\"pushAgent\",\"inputs\":{\"array\":\":array\",\"item\":\":item\"}}}}\n```\n"
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
          "resultInner": {
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
      "agent": "sleepAndMergeAgent",
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
            "agent": "copyAgent",
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
      "agent": "copyAgent",
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
            "agent": "copyAgent",
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
      "agent": "copyAgent",
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
            "agent": "copyAgent",
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
      "agent": "copyAgent",
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
      "update": ":reducer.array"
    },
    "item": {
      "agent": "sleepAndMergeAgent",
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
      "update": ":reducer.array"
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
            "update": ":reducer.array"
          },
          "item": {
            "agent": "sleepAndMergeAgent",
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
            "update": ":reducer.array",
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
            "update": ":reducer.array"
          },
          "item": {
            "agent": "sleepAndMergeAgent",
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
            "agent": "sleepAndMergeAgent",
            "inputs": {
              "array": [
                ":row.level1"
              ]
            }
          },
          "forked2": {
            "agent": "sleepAndMergeAgent",
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
    "copyAgent": {
      "agent": "copyAgent",
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
    "copyAgent": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": [
          ":echo"
        ]
      }
    },
    "copyAgent2": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": [
          ":copyAgent.$0"
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
          "copyAgent": {
            "agent": "copyAgent",
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
    "copyAgent2": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":mapNode.copyAgent"
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
          "copyAgent": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": [
                ":row"
              ]
            }
          },
          "copyAgent2": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "text"
            },
            "inputs": {
              "text": ":copyAgent"
            }
          },
          "copyAgent3": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "text"
            },
            "inputs": {
              "text": ":copyAgent2.$0"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "copyAgent4": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": ":mapNode.copyAgent3"
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
          "copyAgent": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            }
          },
          "copyAgent2": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "array"
            },
            "inputs": {
              "array": [
                ":copyAgent",
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
    "copyAgent3": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": ":mapNode.copyAgent2"
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
    "copyAgent": {
      "agent": "copyAgent",
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
    "copyAgent2": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":copyAgent",
          ":copyAgent"
        ]
      }
    },
    "copyAgent3": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":copyAgent2",
          ":copyAgent2"
        ]
      }
    }
  }
}
```




