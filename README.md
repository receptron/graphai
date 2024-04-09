# GraphAI

## Overview

GraphAI is an asynchronous data flow execution engine, which makes it easy to create AI applications that need to make asynchronous AI API calls multiple times with some dependencies among them, such as giving the answer from one LLM call to another LLM call as a prompt.

You just need to describe dependencies among those API calls in a single data flow graph (typically in YAML), create a GraphAI object with it, and run it.

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

``` TypeScript
const nodeExecute = async (context: NodeExecAgentFunctionuteContext) => {
  const { 
    nodeId, // taskA, taskB or taskC 
    params, // app-specific/task-specific parameters specified in the graph definition file
    payload // for taskC, { taskA: resultA, taskB: resultB }
  } = context;
  // App-specific code (such as calling OpenAI's chat.completions API)
  ...
  return result;
}

  ...
  const file = fs.readFileSync(pathToYamlFile, "utf8");
  const graphdata = YAML.parse(file);
  const graph = new GraphAI(graph_data, nodeExecute);
  const results = await graph.run();
  return results["taskC"];
```

## Data Flow Graph

A Data Flow Graph (DFG) is a JSON object, which defines the flow of data. It is typically described in YAML file and loaded at runtime.

A DFG consists of a collection of 'nodes', which contains a series of nested keys representing individual nodes in the data flow. Each node is identified by a unique key (e.g., node1, node2) and can contain several predefined keys (params, inputs, retry, timeout, source, dispatch) that dictate the node's behavior and its relationship with other nodes.

