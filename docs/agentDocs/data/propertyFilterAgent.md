# propertyFilterAgent

## Description

Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'

## Schema

#### inputs

```json

{
  "type": "object"
}

````

#### output

```json

{
  "type": "any",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array to apply filter"
    },
    "item": {
      "type": "object",
      "description": "the object to apply filter"
    }
  }
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model"
]

````
```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.color",
  ":agentId.$0.model",
  ":agentId.$1",
  ":agentId.$1.color",
  ":agentId.$1.model"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.type",
  ":agentId.$0.maker",
  ":agentId.$0.range",
  ":agentId.$1",
  ":agentId.$1.type",
  ":agentId.$1.maker",
  ":agentId.$1.range"
]

````
```json

[
  ":agentId",
  ":agentId.type",
  ":agentId.maker",
  ":agentId.range"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.color",
  ":agentId.$0.model",
  ":agentId.$0.type",
  ":agentId.$0.maker",
  ":agentId.$0.range",
  ":agentId.$1",
  ":agentId.$1.color",
  ":agentId.$1.model",
  ":agentId.$1.type",
  ":agentId.$1.maker",
  ":agentId.$1.range"
]

````
```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model",
  ":agentId.type",
  ":agentId.maker",
  ":agentId.range"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.color",
  ":agentId.$0.model",
  ":agentId.$0.type",
  ":agentId.$0.maker",
  ":agentId.$0.range",
  ":agentId.$1",
  ":agentId.$1.color",
  ":agentId.$1.model",
  ":agentId.$1.type",
  ":agentId.$1.maker",
  ":agentId.$1.range"
]

````
```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model",
  ":agentId.type",
  ":agentId.maker",
  ":agentId.range"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.color",
  ":agentId.$0.model",
  ":agentId.$0.type",
  ":agentId.$0.maker",
  ":agentId.$0.range",
  ":agentId.$1",
  ":agentId.$1.color",
  ":agentId.$1.model",
  ":agentId.$1.type",
  ":agentId.$1.maker",
  ":agentId.$1.range"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.color",
  ":agentId.$0.model",
  ":agentId.$0.type",
  ":agentId.$0.maker",
  ":agentId.$0.range",
  ":agentId.$1",
  ":agentId.$1.color",
  ":agentId.$1.model",
  ":agentId.$1.type",
  ":agentId.$1.maker",
  ":agentId.$1.range"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.color",
  ":agentId.$0.model",
  ":agentId.$0.type",
  ":agentId.$0.maker",
  ":agentId.$0.range",
  ":agentId.$0.isTesla",
  ":agentId.$0.isGM",
  ":agentId.$1",
  ":agentId.$1.color",
  ":agentId.$1.model",
  ":agentId.$1.type",
  ":agentId.$1.maker",
  ":agentId.$1.range",
  ":agentId.$1.isTesla",
  ":agentId.$1.isGM"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    {
      "color": "red",
      "model": "Model 3",
      "type": "EV",
      "maker": "Tesla",
      "range": 300
    }
  ]
}

````

#### params

```json

{"include":["color","model"]}

````

#### result

```json

{
  "color": "red",
  "model": "Model 3"
}

````
### Sample1

#### inputs

```json

{
  "item": {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla",
    "range": 300
  }
}

````

#### params

```json

{"include":["color","model"]}

````

#### result

```json

{
  "color": "red",
  "model": "Model 3"
}

````
### Sample2

#### inputs

```json

{
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
}

````

#### params

```json

{"include":["color","model"]}

````

#### result

```json

[
  {
    "color": "red",
    "model": "Model 3"
  },
  {
    "color": "blue",
    "model": "Model Y"
  }
]

````
### Sample3

#### inputs

```json

{
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
}

````

#### params

```json

{"exclude":["color","model"]}

````

#### result

```json

[
  {
    "type": "EV",
    "maker": "Tesla",
    "range": 300
  },
  {
    "type": "EV",
    "maker": "Tesla",
    "range": 400
  }
]

````
### Sample4

#### inputs

```json

{
  "item": {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla",
    "range": 300
  }
}

````

#### params

```json

{"exclude":["color","model"]}

````

#### result

```json

{
  "type": "EV",
  "maker": "Tesla",
  "range": 300
}

````
### Sample5

#### inputs

```json

{
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
}

````

#### params

```json

{"alter":{"color":{"red":"blue","blue":"red"}}}

````

#### result

```json

[
  {
    "color": "blue",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla",
    "range": 300
  },
  {
    "color": "red",
    "model": "Model Y",
    "type": "EV",
    "maker": "Tesla",
    "range": 400
  }
]

````
### Sample6

#### inputs

```json

{
  "item": {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla",
    "range": 300
  }
}

````

#### params

```json

{"alter":{"color":{"red":"blue","blue":"red"}}}

````

#### result

```json

{
  "color": "blue",
  "model": "Model 3",
  "type": "EV",
  "maker": "Tesla",
  "range": 300
}

````
### Sample7

#### inputs

```json

{
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
}

````

#### params

```json

{"swap":{"maker":"model"}}

````

#### result

```json

[
  {
    "color": "red",
    "model": "Tesla",
    "type": "EV",
    "maker": "Model 3",
    "range": 300
  },
  {
    "color": "blue",
    "model": "Tesla",
    "type": "EV",
    "maker": "Model Y",
    "range": 400
  }
]

````
### Sample8

#### inputs

```json

{
  "item": {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla",
    "range": 300
  }
}

````

#### params

```json

{"swap":{"maker":"model"}}

````

#### result

```json

{
  "color": "red",
  "model": "Tesla",
  "type": "EV",
  "maker": "Model 3",
  "range": 300
}

````
### Sample9

#### inputs

```json

{
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
}

````

#### params

```json

{"inject":[{"propId":"maker","from":1}]}

````

#### result

```json

[
  {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla Motors",
    "range": 300
  },
  {
    "color": "blue",
    "model": "Model Y",
    "type": "EV",
    "maker": "Tesla Motors",
    "range": 400
  }
]

````
### Sample10

#### inputs

```json

{
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
}

````

#### params

```json

{"inject":[{"propId":"maker","from":1,"index":0}]}

````

#### result

```json

[
  {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla Motors",
    "range": 300
  },
  {
    "color": "blue",
    "model": "Model Y",
    "type": "EV",
    "maker": "Tesla",
    "range": 400
  }
]

````
### Sample11

#### inputs

```json

{
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
}

````

#### params

```json

{"inspect":[{"propId":"isTesla","equal":"Tesla Motors"},{"propId":"isGM","notEqual":"Tesla Motors","from":1}]}

````

#### result

```json

[
  {
    "color": "red",
    "model": "Model 3",
    "type": "EV",
    "maker": "Tesla",
    "range": 300,
    "isTesla": true,
    "isGM": false
  },
  {
    "color": "blue",
    "model": "Model Y",
    "type": "EV",
    "maker": "Tesla",
    "range": 400,
    "isTesla": true,
    "isGM": false
  }
]

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

