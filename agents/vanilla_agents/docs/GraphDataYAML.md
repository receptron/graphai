#### dynamicGraphData
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

#### dynamicGraphData2
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

#### dynamicGraphData3
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

#### nestedGraphData
```yaml
version: 0.5
nodes:
  source:
    value: Hello World
  nestedNode:
    agent: nestedAgent
    inputs:
      inner0: :source
    isResult: true
    graph:
      nodes:
        result:
          agent: copyAgent
          inputs:
            - :inner0
          isResult: true

```

#### nestedGraphData2
```yaml
version: 0.5
nodes:
  source:
    value: Hello World
  nestedNode:
    agent: nestedAgent
    inputs:
      source: :source
    isResult: true
    graph:
      nodes:
        result:
          agent: copyAgent
          inputs:
            - :source
          isResult: true

```
