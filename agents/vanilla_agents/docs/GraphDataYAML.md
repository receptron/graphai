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
          agent: sleepAndMergeAgent
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
    value: '{"version":0.5,"loop":{"count":5},"nodes":{"array":{"value":[],"update":":reducer"},"item":{"agent":"sleepAndMergeAgent","params":{"duration":10,"value":"hello"}},"reducer":{"isResult":true,"agent":"pushAgent","inputs":{"array":":array","item":":item"}}}}'
  parser:
    agent: jsonParserAgent
    inputs:
      text: :source
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

      {"version":0.5,"loop":{"count":5},"nodes":{"array":{"value":[],"update":":reducer"},"item":{"agent":"sleepAndMergeAgent","params":{"duration":10,"value":"hello"}},"reducer":{"isResult":true,"agent":"pushAgent","inputs":{"array":":array","item":":item"}}}}

      ```
  parser:
    agent: jsonParserAgent
    inputs:
      text: :source
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
        resultInner:
          agent: copyAgent
          inputs:
            text: :inner0
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
            text: :source
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
            template: I love ${m}.
          inputs:
            m: :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: sleepAndMergeAgent
    inputs:
      array:
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
          params:
            namedKey: row
          inputs:
            row: :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: bypassAgent
    params:
      namedKey: result
    inputs:
      result:
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
          params:
            namedKey: row
          inputs:
            row: :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: bypassAgent
    params:
      namedKey: result
    inputs:
      result: :nestedNode.node1

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
          params:
            namedKey: row
          inputs:
            row: :row
          isResult: true
    params:
      compositeResult: true
  result:
    agent: bypassAgent
    params:
      flat: 2
      namedKey: res
    inputs:
      res: :nestedNode.node1

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
    agent: sleepAndMergeAgent
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
          agent: sleepAndMergeAgent
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
          agent: sleepAndMergeAgent
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
          agent: sleepAndMergeAgent
          inputs:
            array:
              - :row.level1
        forked2:
          agent: sleepAndMergeAgent
          inputs:
            array:
              - :forked
          isResult: true
    params:
      compositeResult: true
  bypassAgent:
    agent: bypassAgent
    params:
      namedKey: result
    inputs:
      result:
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
    params:
      namedKey: text
    inputs:
      text:
        - :echo
  bypassAgent2:
    agent: bypassAgent
    params:
      namedKey: text
    inputs:
      text:
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
          params:
            namedKey: row
          inputs:
            row: :row
          isResult: true
    params:
      compositeResult: true
  bypassAgent2:
    agent: bypassAgent
    params:
      namedKey: array
    inputs:
      array:
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
          params:
            namedKey: row
          inputs:
            row:
              - :row
        bypassAgent2:
          agent: bypassAgent
          params:
            namedKey: text
          inputs:
            text: :bypassAgent
        bypassAgent3:
          agent: bypassAgent
          params:
            namedKey: text
          inputs:
            text: :bypassAgent2.$0
          isResult: true
    params:
      compositeResult: true
  bypassAgent4:
    agent: bypassAgent
    params:
      namedKey: text
    inputs:
      text: :mapNode.bypassAgent3

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
          params:
            namedKey: row
          inputs:
            row: :row
        bypassAgent2:
          agent: bypassAgent
          params:
            namedKey: array
          inputs:
            array:
              - :bypassAgent
              - :row
          isResult: true
    params:
      compositeResult: true
  bypassAgent3:
    agent: bypassAgent
    params:
      namedKey: text
    inputs:
      text: :mapNode.bypassAgent2

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
    params:
      namedKey: array
    inputs:
      array:
        - :echo
        - :echo
        - :echo
  bypassAgent2:
    agent: bypassAgent
    params:
      namedKey: array
    inputs:
      array:
        - :bypassAgent
        - :bypassAgent
  bypassAgent3:
    agent: bypassAgent
    params:
      namedKey: array
    inputs:
      array:
        - :bypassAgent2
        - :bypassAgent2

```
