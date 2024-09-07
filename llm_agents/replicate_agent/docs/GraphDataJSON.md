### GraphData Example

#### graphDataReplicateMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "replicateAgent",
      "inputs": {
        "prompt": ":inputData"
      },
      "params": {
        "model": "meta/meta-llama-3-70b-instruct"
      }
    }
  }
}
```
