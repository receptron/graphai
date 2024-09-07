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
        - https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kumamoto_Castle_Keep_Tower_20221022-3.jpg/1920px-Kumamoto_Castle_Keep_Tower_20221022-3.jpg
    isResult: true

```
