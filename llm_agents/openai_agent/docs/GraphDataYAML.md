#### graphDataOpenAIMath
```yaml
version: 0.5
nodes:
  inputData:
    value: hello, let me know the answer 1 + 1
  llm:
    agent: openAIAgent
    inputs:
      prompt: :inputData
    params:
      max_tokens: 2000

```

#### graphDataOpenAIPaint
```yaml
version: 0.5
nodes:
  inputData:
    value: dragon flying in the sky
  llm:
    agent: openAIImageAgent
    inputs:
      prompt: :inputData
    params:
      system: Generate user-specified image
      model: dall-e-3
    isResult: true

```

#### graphDataOpenAIImageDescription
```yaml
version: 0.5
nodes:
  inputData:
    value: what is this
  llm:
    agent: openAIAgent
    inputs:
      prompt: :inputData
    params:
      model: gpt-4o-mini
      system: Describe the given image
      images:
        - https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/zidane.jpg
    isResult: true

```
