#### graphDataGeminiMath
```yaml
version: 0.5
nodes:
  inputData:
    value: hello, let me know the answer to 1 + 1
  llm:
    agent: geminiAgent
    inputs:
      prompt: :inputData
```
