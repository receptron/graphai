# GraphAI

GraphAI is an asynchronous data flow execution engine, which makes it easy to create AI applications that need to make asynchronous AI API calls multiple times with some dependencies among them, such as giving the answer from one LLM call to another LLM call as a prompt.

You just need to describe dependencies among those API calls in a single graph definition file (in JSON or YAML), create a GraphAI object with it, and run it.

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
const nodeExecute = async (context: NodeExecuteContext) => {
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


