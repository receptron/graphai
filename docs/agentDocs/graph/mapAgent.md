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

## Input Format

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
  ":agentId.row",
  ":agentId.row.$0",
  ":agentId.row.$1"
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
### Sample2

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

{
  "test": [
    [
      1
    ],
    [
      2
    ]
  ],
  "row": [
    1,
    2
  ]
}

````
### Sample3

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

{
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

