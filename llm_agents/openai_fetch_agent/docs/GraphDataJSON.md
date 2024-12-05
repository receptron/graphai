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
      "agent": "openAIFetchAgent",
      "inputs": {
        "prompt": ":inputData"
      }
    }
  }
}
```

#### graphDataOpenAIImageDescription
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "what is this"
    },
    "llm": {
      "agent": "openAIFetchAgent",
      "inputs": {
        "prompt": ":inputData"
      },
      "params": {
        "model": "gpt-4o-mini",
        "system": "Describe the given image",
        "images": [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kumamoto_Castle_Keep_Tower_20221022-3.jpg/1920px-Kumamoto_Castle_Keep_Tower_20221022-3.jpg"
        ]
      },
      "isResult": true
    }
  }
}
```
