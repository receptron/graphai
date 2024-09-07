### GraphData Example

#### graphDataOpenAIMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "openAIAgent",
      "inputs": {
        "prompt": ":inputData"
      }
    }
  }
}
```
