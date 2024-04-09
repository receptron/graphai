# GraphAI

## Overview

GraphAI is an asynchronous data flow execution engine, which makes it easy to create AI applications that need to make asynchronous AI API calls multiple times with some dependencies among them, such as giving the answer from one LLM call to another LLM call as a prompt.

You just need to describe dependencies among those API calls in a single data flow graph (typically in YAML), create a GraphAI object with it, and run it.

Here is an example:

```YAML
nodes:
  taskA:
    params:
      // agent-specific parameters for taskA
  taskB:
    params:
      // agent-specific parameters for taskB
  taskC:
    params:
      // agent-specific parameters for taskC
    inputs: [taskA, taskB]
```

``` TypeScript
const sampleAgentFunction = async (context: AgentFunctionContext) => {
  const { 
    nodeId, // taskA, taskB or taskC 
    params, // agent-specific parameters specified in the graph definition file
    payload // for taskC, { taskA: resultA, taskB: resultB }
  } = context;
  // Agent-specific code (such as calling OpenAI's chat.completions API)
  ...
  return result;
}

  ...
  const file = fs.readFileSync(pathToYamlFile, "utf8");
  const graphdata = YAML.parse(file);
  const graph = new GraphAI(graph_data, sampleAgentFunction);
  const results = await graph.run();
  return results["taskC"];
```

## Data Flow Graph

A Data Flow Graph (DFG) is a JSON object, which defines the flow of data. It is typically described in YAML file and loaded at runtime.

A DFG consists of a collection of 'nodes', which contains a series of nested keys representing individual nodes in the data flow. Each node is identified by a unique key (e.g., node1, node2) and can contain several predefined keys (params, inputs, retry, timeout, source, dispatch, agentId) that dictate the node's behavior and its relationship with other nodes.

### DFG Structure

- 'nodes': A list of node. Required.
- 'concurrency': An optional property, which specifies the maximum number of concurrent operations (agent functions to be executed at the same time). The default is 8.

## Agent

An agent is an abstract object, which takes some inputs and generates an output asynchronously. It could be an LLM (such as GPT-4), an image/video/music generator, a database, or a REST API over HTTP. Each node (except 'source node') is associated with an agent function, which takes data flow into the node as inputs, and generates an output.

## Agent function

An agent function is a TypeScript function, which implements an agent. A DFG is associated one or more agent functions. If the DFG is associated with multiple agent functions, each node needs to be associated only one of them (either explicitly with 'agentId' or implicitly to the default Agent function).

An agent function receives two set of parameters via AgentFunctionContext, agent specific parameters specified in the DFG and input data came from other nodes (payload).

A regular agent function returns the data (type: ```Record<string, any>```), but a dispatcher agent function returns the date with outputID(s) (type: ```Record<string: Record<string, any>>```). 

## Node Structure

- 'inputs': An optional list of node identifiers that the current node depends on. This establishes a flow where the current node can only be executed after the completion of the nodes listed under 'inputs'. If this list is empty and the 'source' property is not set, the associated Agent Function will be immediatley executed. 
- 'source': An optional flag, which specifies if the node is a 'source node' or not. A souce node is a special node, which receives data from either an external code (via GraphAI's injectResult method) or from a 'dispatcher node'.
- 'dispatch': An optinal property (type: ```Record<string, string>```) which indicates that the current node is a 'dispatcher node'. A dispatcher node is associated is a dispaher-style agent function, which has multiple possible 'outputs'.
- 'retry': An optional number, which specifies the maximum number of retries to be made. If the last attempt fails, that return value will be recorded.
- 'timeout': An optional number, which specifies the maximum waittime in msec. If the associated agent function does not return the value in time, the "Timeout" error will be recorded and the returned value will be discarded. 
- 'params': An optional parameters to the associated agent function, which are agent specific.
- 'payloadMapping': An optional property (type: ```Record<string, string>```), which maps input nodeIds to agent specific inputIDs.

## GraphAI class

### ```constructor(data: GraphData, callbackDictonary: AgentFunctionDictonary | AgentFunction<any, any, any>)```
Initializes a new instance of the GraphAI class with the specified graph data and a dictionary of callback functions.

- ```data: GraphData```: The graph data including nodes and optional concurrency limit.
- ```callbackDictonary: AgentFunctionDictonary | AgentFunction<any, any, any>```: A dictionary mapping agent IDs to their respective callback functions, or a single default callback function to be used for all nodes.

### ```async run(): Promise<ResultDataDictonary<ResultData>>```
Executes the graph asynchronously, starting with nodes that have no dependencies or whose dependencies have been met. The method continues to execute nodes as their dependencies are satisfied until all nodes have been executed or an error occurs.

Returns: A promise that resolves with the results of all executed nodes or rejects with the first encountered error.

### ```results(): ResultDataDictonary<ResultData>```
Compiles and returns the results of all executed nodes in the graph.

Returns: A dictionary mapping node IDs to their results. Only includes nodes that have completed execution and produced a result.

### ```errors(): Record<string, Error>```
Compiles and returns the errors from all nodes that encountered an error during execution.

Returns: A dictionary mapping node IDs to the errors they encountered. Only includes nodes that have executed and encountered an error. It does not include any errors which have been retried.

### ```transactionLogs(): Array<TransactionLog>```
Retrieves all transaction logs recorded during the execution of the graph.

Returns: An array of transaction logs detailing the execution states and outcomes of the nodes within the graph.

### ```injectResult(nodeId: string, result: ResultData): void```
Injects a result into a specified node. This is used to manually set the result of a source node, allowing dependent nodes to proceed with execution.

- ```nodeId: string```: The ID of the source node into which the result is to be injected.
- ```result: ResultData```: The result to be injected into the specified node.
