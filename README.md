# GraphAI

GraphAI is a TypeScript library, which makes it easy to create AI applications that need to call asynchrouns AI API calls multiple times. You just need to describe dependencies among those API calls in a single JSON/YAML file, create a GraphAI object with it, and run it.

Here is an example:

```YAML
nodes:
  taskA:
    params:
      // app-specific parameters for taskA
  taskB:
    params:
      // app-specific parameters for taskB
  taskC:
    params:
      // app-specific parameters for taskC
    inputs: [taskA, taskB]
```

