## graphdata
```yaml
version: 0.5
nodes:
  source:
    value:
      version: 0.5
      loop:
        count: 5
      nodes:
        array:
          value: []
          update: :reducer
        item:
          agent: sleeperAgent
          params:
            duration: 10
            value: hello
        reducer:
          isResult: true
          agent: pushAgent
          inputs:
            array: :array
            item: :item
  nested:
    agent: nestedAgent
    graph: :source
    isResult: true

```

## graphdata2
```yaml
version: 0.5
nodes:
  source:
    value: '{"version":0.5,"loop":{"count":5},"nodes":{"array":{"value":[],"update":":reducer"},"item":{"agent":"sleeperAgent","params":{"duration":10,"value":"hello"}},"reducer":{"isResult":true,"agent":"pushAgent","inputs":{"array":":array","item":":item"}}}}'
  parser:
    agent: jsonParserAgent
    inputs:
      - :source
  nested:
    agent: nestedAgent
    graph: :parser
    isResult: true

```

## graphdata3
```yaml
version: 0.5
nodes:
  source:
    value: >
      ```json

      {"version":0.5,"loop":{"count":5},"nodes":{"array":{"value":[],"update":":reducer"},"item":{"agent":"sleeperAgent","params":{"duration":10,"value":"hello"}},"reducer":{"isResult":true,"agent":"pushAgent","inputs":{"array":":array","item":":item"}}}}

      ```
  parser:
    agent: jsonParserAgent
    inputs:
      - :source
  nested:
    agent: nestedAgent
    graph: :parser
    isResult: true

```
