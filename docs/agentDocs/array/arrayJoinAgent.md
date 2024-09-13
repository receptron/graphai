# arrayJoinAgent

## Description

Array Join Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "array join"
    }
  },
  "required": [
    "array"
  ]
}

````

#### output

```json

{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "joined text"
    }
  }
}

````

## Input Format

```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````
```json

[
  ":agentId",
  ":agentId.text"
]

````

## Samples

### Sample0

#### inputs

```json

{
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "text": "123"
}

````
### Sample1

#### inputs

```json

{
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "text": "123"
}

````
### Sample2

#### inputs

```json

{
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "text": "abc"
}

````
### Sample3

#### inputs

```json

{
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
}

````

#### params

```json

{"separator":"|"}

````

#### result

```json

{
  "text": "1|2|3"
}

````
### Sample4

#### inputs

```json

{
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
}

````

#### params

```json

{"separator":"|"}

````

#### result

```json

{
  "text": "1|2,3"
}

````
### Sample5

#### inputs

```json

{
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
}

````

#### params

```json

{"separator":"|","flat":1}

````

#### result

```json

{
  "text": "1|2|3"
}

````
### Sample6

#### inputs

```json

{
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
}

````

#### params

```json

{"separator":"|","flat":1}

````

#### result

```json

{
  "text": "1|2,3"
}

````
### Sample7

#### inputs

```json

{
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
}

````

#### params

```json

{"separator":"|","flat":2}

````

#### result

```json

{
  "text": "1|2|3"
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

