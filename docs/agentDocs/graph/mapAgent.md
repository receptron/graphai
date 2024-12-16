# mapAgent

## Description

Map Agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "rows": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "rows"
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.test",
  ":agentId.$0.test.$0",
  ":agentId.$1",
  ":agentId.$1.test",
  ":agentId.$1.test.$0"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.node2",
  ":agentId.$1",
  ":agentId.$1.node2",
  ":agentId.$2",
  ":agentId.$2.node2",
  ":agentId.$3",
  ":agentId.$3.node2",
  ":agentId.$4",
  ":agentId.$4.node2",
  ":agentId.$5",
  ":agentId.$5.node2",
  ":agentId.$6",
  ":agentId.$6.node2"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.node2",
  ":agentId.$1",
  ":agentId.$1.node2"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.node2",
  ":agentId.$1",
  ":agentId.$1.node2"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.__mapIndex",
  ":agentId.$0.test",
  ":agentId.$0.test.$0",
  ":agentId.$0.row",
  ":agentId.$1",
  ":agentId.$1.__mapIndex",
  ":agentId.$1.test",
  ":agentId.$1.test.$0",
  ":agentId.$1.row"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.__mapIndex",
  ":agentId.$0.map",
  ":agentId.$0.map.$0",
  ":agentId.$0.map.$0.test",
  ":agentId.$0.map.$1",
  ":agentId.$0.map.$1.test",
  ":agentId.$0.row",
  ":agentId.$0.test",
  ":agentId.$1",
  ":agentId.$1.__mapIndex",
  ":agentId.$1.map",
  ":agentId.$1.map.$0",
  ":agentId.$1.map.$0.test",
  ":agentId.$1.map.$1",
  ":agentId.$1.map.$1.test",
  ":agentId.$1.test",
  ":agentId.$1.row"
]

````
```json

[
  ":agentId",
  ":agentId.test",
  ":agentId.test.$0",
  ":agentId.test.$0.$0",
  ":agentId.test.$1",
  ":agentId.test.$1.$0"
]

````
```json

[
  ":agentId",
  ":agentId.node2",
  ":agentId.node2.$0",
  ":agentId.node2.$1",
  ":agentId.node2.$2",
  ":agentId.node2.$3",
  ":agentId.node2.$4",
  ":agentId.node2.$5",
  ":agentId.node2.$6"
]

````
```json

[
  ":agentId",
  ":agentId.test",
  ":agentId.test.$0",
  ":agentId.test.$0.$0",
  ":agentId.test.$1",
  ":agentId.test.$1.$0",
  ":agentId.__mapIndex",
  ":agentId.__mapIndex.$0",
  ":agentId.__mapIndex.$1",
  ":agentId.row",
  ":agentId.row.$0",
  ":agentId.row.$1"
]

````
```json

[
  ":agentId",
  ":agentId.__mapIndex",
  ":agentId.__mapIndex.$0",
  ":agentId.__mapIndex.$1",
  ":agentId.test",
  ":agentId.test.$0",
  ":agentId.test.$0.$0",
  ":agentId.test.$1",
  ":agentId.test.$1.$0",
  ":agentId.map",
  ":agentId.map.$0",
  ":agentId.map.$0.test",
  ":agentId.map.$0.test.$0",
  ":agentId.map.$0.test.$0.$0",
  ":agentId.map.$0.test.$0.$0.$0",
  ":agentId.map.$0.test.$1",
  ":agentId.map.$0.test.$1.$0",
  ":agentId.map.$0.test.$1.$0.$0",
  ":agentId.map.$1",
  ":agentId.map.$1.test",
  ":agentId.map.$1.test.$0",
  ":agentId.map.$1.test.$0.$0",
  ":agentId.map.$1.test.$0.$0.$0",
  ":agentId.map.$1.test.$1",
  ":agentId.map.$1.test.$1.$0",
  ":agentId.map.$1.test.$1.$0.$0",
  ":agentId.row",
  ":agentId.row.$0",
  ":agentId.row.$1"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "rows": [
    1,
    2
  ]
}

````

#### params

```json

{}

````

#### result

```json

[
  {
    "test": [
      1
    ]
  },
  {
    "test": [
      2
    ]
  }
]

````
### Sample1

#### inputs

```json

{
  "rows": [
    "apple",
    "orange",
    "banana",
    "lemon",
    "melon",
    "pineapple",
    "tomato"
  ]
}

````

#### params

```json

{}

````

#### result

```json

[
  {
    "node2": "I love apple."
  },
  {
    "node2": "I love orange."
  },
  {
    "node2": "I love banana."
  },
  {
    "node2": "I love lemon."
  },
  {
    "node2": "I love melon."
  },
  {
    "node2": "I love pineapple."
  },
  {
    "node2": "I love tomato."
  }
]

````
### Sample2

#### inputs

```json

{
  "rows": [
    {
      "fruit": "apple"
    },
    {
      "fruit": "orange"
    }
  ]
}

````

#### params

```json

{}

````

#### result

```json

[
  {
    "node2": "I love apple."
  },
  {
    "node2": "I love orange."
  }
]

````
### Sample3

#### inputs

```json

{
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
}

````

#### params

```json

{}

````

#### result

```json

[
  {
    "node2": "You like apple."
  },
  {
    "node2": "You like orange."
  }
]

````
### Sample4

#### inputs

```json

{
  "rows": [
    1,
    2
  ]
}

````

#### params

```json

{"resultAll":true}

````

#### result

```json

[
  {
    "__mapIndex": 0,
    "test": [
      1
    ],
    "row": 1
  },
  {
    "__mapIndex": 1,
    "test": [
      2
    ],
    "row": 2
  }
]

````
### Sample5

#### inputs

```json

{
  "rows": [
    1,
    2
  ]
}

````

#### params

```json

{"resultAll":true}

````

#### result

```json

[
  {
    "__mapIndex": 0,
    "map": [
      {
        "test": 1
      },
      {
        "test": 1
      }
    ],
    "row": 1,
    "test": 1
  },
  {
    "__mapIndex": 1,
    "map": [
      {
        "test": 2
      },
      {
        "test": 2
      }
    ],
    "test": 2,
    "row": 2
  }
]

````
### Sample6

#### inputs

```json

{
  "rows": [
    1,
    2
  ]
}

````

#### params

```json

{"compositeResult":true}

````

#### result

```json

{
  "test": [
    [
      1
    ],
    [
      2
    ]
  ]
}

````
### Sample7

#### inputs

```json

{
  "rows": [
    "apple",
    "orange",
    "banana",
    "lemon",
    "melon",
    "pineapple",
    "tomato"
  ]
}

````

#### params

```json

{"compositeResult":true}

````

#### result

```json

{
  "node2": [
    "I love apple.",
    "I love orange.",
    "I love banana.",
    "I love lemon.",
    "I love melon.",
    "I love pineapple.",
    "I love tomato."
  ]
}

````
### Sample8

#### inputs

```json

{
  "rows": [
    1,
    2
  ]
}

````

#### params

```json

{"resultAll":true,"compositeResult":true}

````

#### result

```json

{
  "test": [
    [
      1
    ],
    [
      2
    ]
  ],
  "__mapIndex": [
    0,
    1
  ],
  "row": [
    1,
    2
  ]
}

````
### Sample9

#### inputs

```json

{
  "rows": [
    1,
    2
  ]
}

````

#### params

```json

{"resultAll":true,"compositeResult":true}

````

#### result

```json

{
  "__mapIndex": [
    0,
    1
  ],
  "test": [
    [
      1
    ],
    [
      2
    ]
  ],
  "map": [
    {
      "test": [
        [
          [
            1
          ]
        ],
        [
          [
            1
          ]
        ]
      ]
    },
    {
      "test": [
        [
          [
            2
          ]
        ],
        [
          [
            2
          ]
        ]
      ]
    }
  ],
  "row": [
    1,
    2
  ]
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

