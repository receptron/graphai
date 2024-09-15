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

#### graphDataMap1
```yaml
version: 0.5
nodes:
  source:
    value:
      fruits:
        - apple
        - orange
        - banana
        - lemon
        - melon
        - pineapple
        - tomato
  nestedNode:
    agent: mapAgent
    inputs:
      rows: :source.fruits
    graph:
      version: 0.5
      nodes:
        node2:
          agent: stringTemplateAgent
          params:
            template: I love ${0}.
          inputs:
            - :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: sleeperAgent
    inputs:
      - :nestedNode.node2
    isResult: true

```

#### graphDataMap3
```yaml
version: 0.5
nodes:
  source1:
    value:
      - hello
      - hello2
  nestedNode:
    agent: mapAgent
    inputs:
      rows: :source1
    graph:
      version: 0.5
      nodes:
        node1:
          agent: bypassAgent
          inputs:
            - :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: bypassAgent
    inputs:
      - :nestedNode.node1
    isResult: true

```

#### graphDataMap4
```yaml
version: 0.5
nodes:
  source1:
    value:
      - hello
      - hello2
  nestedNode:
    agent: mapAgent
    inputs:
      rows: :source1
    graph:
      version: 0.5
      nodes:
        node1:
          agent: bypassAgent
          inputs:
            - :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: bypassAgent
    params:
      flat: 1
    inputs:
      - :nestedNode.node1

```

#### graphDataMap5
```yaml
version: 0.5
nodes:
  source1:
    value:
      - hello
      - hello2
  nestedNode:
    agent: mapAgent
    inputs:
      rows: :source1
    graph:
      version: 0.5
      nodes:
        node1:
          agent: bypassAgent
          inputs:
            - :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: bypassAgent
    params:
      flat: 2
    inputs:
      - :nestedNode.node1

```

#### graphDataPush
```yaml
version: 0.5
loop:
  count: 10
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

```

#### graphDataPop
```yaml
version: 0.5
loop:
  while: :source
nodes:
  source:
    value:
      - orange
      - banana
      - lemon
    update: :popper.array
  result:
    value: []
    update: :reducer
  popper:
    inputs:
      array: :source
    agent: popAgent
  reducer:
    agent: pushAgent
    inputs:
      array: :result
      item: :popper.item

```

#### graphDataNested
```yaml
version: 0.5
nodes:
  source:
    value: hello
  parent:
    agent: nestedAgent
    inputs:
      source: :source
    isResult: true
    graph:
      loop:
        count: 10
      nodes:
        array:
          value: []
          update: :reducer
        item:
          agent: sleeperAgent
          params:
            duration: 10
            value: :source
        reducer:
          agent: pushAgent
          inputs:
            array: :array
            item: :item
          isResult: true

```

#### graphDataNestedPop
```yaml
version: 0.5
nodes:
  fruits:
    value:
      - orange
      - banana
      - lemon
  parent:
    agent: nestedAgent
    isResult: true
    inputs:
      fruits: :fruits
    graph:
      loop:
        while: :fruits
      nodes:
        fruits:
          value: []
          update: :popper.array
        result:
          value: []
          update: :reducer
          isResult: true
        popper:
          inputs:
            array: :fruits
          agent: popAgent
        reducer:
          agent: pushAgent
          inputs:
            array: :result
            item: :popper.item

```

#### graphDataNestedInjection
```yaml
version: 0.5
nodes:
  source:
    value: hello
  parent:
    agent: nestedAgent
    inputs:
      inner_source: :source
    isResult: true
    graph:
      loop:
        count: 10
      nodes:
        array:
          value: []
          update: :reducer
        item:
          agent: sleeperAgent
          params:
            duration: 10
            value: :inner_source
        reducer:
          agent: pushAgent
          inputs:
            array: :array
            item: :item
          isResult: true

```

#### forkGraph
```yaml
version: 0.5
nodes:
  source:
    value:
      content:
        - level1:
            level2: hello1
        - level1:
            level2: hello2
  mapNode:
    agent: mapAgent
    inputs:
      rows: :source.content
    graph:
      version: 0.5
      nodes:
        workingMemory:
          value: {}
        forked:
          agent: sleeperAgent
          inputs:
            - :row.level1
        forked2:
          agent: sleeperAgent
          inputs:
            - :forked
          isResult: true
    params:
      compositeResult: true
  bypassAgent:
    agent: bypassAgent
    inputs:
      - :mapNode

```

#### graphDataBypass
```yaml
version: 0.5
nodes:
  echo:
    agent: echoAgent
    params:
      message: hello
  bypassAgent:
    agent: bypassAgent
    inputs:
      - :echo
  bypassAgent2:
    agent: bypassAgent
    inputs:
      - :bypassAgent.$0

```

#### graphDataBypass2
```yaml
version: 0.5
nodes:
  echo:
    agent: echoAgent
    params:
      message:
        - hello
        - hello
  mapNode:
    agent: mapAgent
    inputs:
      rows: :echo.message
    graph:
      version: 0.5
      nodes:
        bypassAgent:
          agent: bypassAgent
          inputs:
            - :row
          isResult: true
          params:
            firstElement: true
    params:
      compositeResult: true
  bypassAgent2:
    agent: bypassAgent
    inputs:
      - :mapNode.bypassAgent

```

#### graphDataBypass3
```yaml
version: 0.5
nodes:
  echo:
    agent: echoAgent
    params:
      message:
        - hello
        - hello
  mapNode:
    agent: mapAgent
    inputs:
      rows: :echo.message
    graph:
      version: 0.5
      nodes:
        bypassAgent:
          agent: bypassAgent
          inputs:
            - :row
        bypassAgent2:
          agent: bypassAgent
          inputs:
            - :bypassAgent.$0
        bypassAgent3:
          agent: bypassAgent
          inputs:
            - :bypassAgent2.$0
          params:
            firstElement: true
          isResult: true
    params:
      compositeResult: true
  bypassAgent4:
    agent: bypassAgent
    params:
      firstElement: true
    inputs:
      - :mapNode.bypassAgent3

```

#### graphDataBypass4
```yaml
version: 0.5
nodes:
  echo:
    agent: echoAgent
    params:
      message:
        - hello
        - hello
  mapNode:
    agent: mapAgent
    inputs:
      rows: :echo.message
    graph:
      version: 0.5
      nodes:
        bypassAgent:
          agent: bypassAgent
          inputs:
            - :row
        bypassAgent2:
          agent: bypassAgent
          inputs:
            - :bypassAgent.$0
            - :row
          isResult: true
    params:
      compositeResult: true
  bypassAgent3:
    agent: bypassAgent
    inputs:
      - :mapNode.bypassAgent2
    params:
      firstElement: true

```

#### graphDataBypass5
```yaml
version: 0.5
nodes:
  echo:
    agent: echoAgent
    params:
      message: hello
  bypassAgent:
    agent: bypassAgent
    inputs:
      - :echo
      - :echo
      - :echo
  bypassAgent2:
    agent: bypassAgent
    inputs:
      - :bypassAgent
      - :bypassAgent
  bypassAgent3:
    agent: bypassAgent
    inputs:
      - :bypassAgent2
      - :bypassAgent2

```
