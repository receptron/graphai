# About GraphAI Streaming

With GraphAI, you can seamlessly handle streaming processes for LLM prompts through server-side, client-side, or server-client integrations.

The term "seamless" here refers to the ability to use GraphAI's default Express middleware or HTTP/Streaming Agent Filters to operate without explicitly managing server-client or streaming processes.

Once implemented, processes can be migrated from the client to the server or adjusted server configurations by simply changing settings with minimal code modification. This flexibility allows developers to focus on business logic without worrying about the complexities of implementing streaming processes.

# Overview of Streaming Processes

1. **Sequential Data Transmission**
   During an agent's execution, data is passed to the Agent Filter via a callback function as it is generated. Instead of processing data in bulk, the callback function is invoked sequentially to handle each data unit.

2. **Processing within Callback Functions**
   The callback function receives information such as `nodeId`, `agentId`, and `data` from the context and processes data individually for different environments.

   - **In Browsers**
     Data received through the callback function is displayed in real time in the browser, enabling live updates.

   - **In Express (Web Servers)**
     Data received through the callback function is processed and returned as an HTTP response. This enables immediate responses in scenarios where APIs are utilized.

This mechanism facilitates real-time data processing, display, and responses during agent execution.

## Passing Data to Agent Filters within Agents

https://github.com/receptron/graphai/blob/e720821dff1a4f59423dbb02db64aaec3a2a61eb/llm_agents/openai_agent/src/openai_agent.ts#L120-L125

## agentFilter

This section explains how to use the `streamAgentFilterGenerator` function to create a `agentFilter` for streaming processes. By specifying a callback function, users can acquire an `agentFilter` capable of processing data in real time.

https://github.com/receptron/graphai/blob/e720821dff1a4f59423dbb02db64aaec3a2a61eb/packages/agent_filters/src/filters/stream.ts#L3-L13

### Usage

1. **Define a Callback Function**
   Create a callback function that takes `context` and `data` as arguments. This function is invoked each time the agent receives data, allowing real-time processing.

```typescript
   const myCallback = (context, data) => {
     console.log("Data received:", data);
     // Implement necessary processing here
   };
```

2. **Obtain the streamAgentFilter**
   Pass the callback function to the `streamAgentFilterGenerator` to generate an `agentFilter` that processes data sequentially. This `agentFilter` handles real-time data processing during agent execution.

```typescript
const myAgentFilter = streamAgentFilterGenerator(myCallback);
```

This completes the setup for agentFilter processing using `streamAgentFilterGenerator`. Pass this agentFilter to the `agentFilters` parameter of the GraphAI constructor to build a mechanism for sequential data processing through callback functions.

## About Streaming Processes

### 1. Direct Usage of GraphAI (Browser)

- Receive streaming data through a callback function via the Agent Filter.
- Obtain the overall result from `graphai.run()`.
- Streaming and result processing can be controlled on the implementation side, without needing to consider delimiters or data formats.

### 2. Express Usage

- Sequential strings are sent due to HTTP mechanisms.
- By default, tokens (strings) stream sequentially, and the result (content) is returned as a JSON string after an `__END__` delimiter.
- Token processing, delimiters, and content handling can be customized by passing a callback function to Express.

## Express Control

Express provides middleware to support streaming servers, non-streaming servers, and servers supporting both. By using middleware that supports both, streaming control is possible through HTTP headers, even if the agent supports streaming.

Specific determination is made based on the presence of the following HTTP header:

- `Content-Type` set to `text/event-stream`.

## Reference Sources

- Example of Express callback function:
  https://github.com/receptron/graphai-utils/blob/b302835d978ce1017c6e105898431eda28adcbd4/packages/express/src/agents.ts#L122-L135

- Implementation of Express:
  https://github.com/receptron/graphai-utils/tree/main/packages/express/src

- Implementation of streamAgentFilterGenerator:
  https://github.com/receptron/graphai/blob/main/packages/agent_filters/src/filters/stream.ts

- Implementation of httpAgentFilter (GraphAI Agent's agent Filter client format):
  https://github.com/receptron/graphai/blob/main/packages/agent_filters/src/filters/http_client.ts

