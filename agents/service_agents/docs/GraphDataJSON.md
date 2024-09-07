## graphDataFetch
```json
{
  "version": 0.5,
  "nodes": {
    "url": {
      "value": "https://www.google.com/search?q=hello"
    },
    "fetch": {
      "agent": "fetchAgent",
      "params": {
        "type": "text"
      },
      "inputs": {
        "url": ":url"
      }
    },
    "success": {
      "agent": "copyAgent",
      "isResult": true,
      "unless": ":fetch.onError",
      "inputs": [
        true
      ]
    },
    "error": {
      "agent": "copyAgent",
      "isResult": true,
      "if": ":fetch.onError",
      "inputs": [
        ":fetch.onError"
      ]
    }
  }
}
```

## graphDataPost
```json
{
  "version": 0.5,
  "nodes": {
    "url": {
      "value": "https://www.google.com/search?q=hello"
    },
    "fetch": {
      "agent": "fetchAgent",
      "params": {
        "type": "text"
      },
      "inputs": {
        "url": ":url",
        "body": "Posting data"
      }
    },
    "success": {
      "agent": "copyAgent",
      "isResult": true,
      "unless": ":fetch.onError",
      "inputs": [
        true
      ]
    },
    "error": {
      "agent": "propertyFilterAgent",
      "params": {
        "include": [
          "message",
          "status"
        ]
      },
      "isResult": true,
      "if": ":fetch.onError",
      "inputs": [
        ":fetch.onError"
      ]
    }
  }
}
```
