# GraphAI

GraphAI is a TypeScript library, which makes it easy to create AI applications that need to make asynchronous AI API calls multiple times with some dependencies among them, such as giving the answer from one LLM call to another LLM call as a prompt. 

You just need to describe dependencies among those API calls in a single JSON/YAML file, create a GraphAI object with it, and run it.

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

