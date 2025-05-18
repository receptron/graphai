# @graphai/stream_agent_filters for GraphAI

## Install

```
yarn add @graphai/stream_agent_filters
```

## Usage

### streamAgentFilterGenerator

Receive stream data externally through streamTokenCallback of filterParams.
Available for both server and client. See express code.

#### server

https://github.com/receptron/graphai_utils/blob/main/packages/express/src/express.ts

express server
```typescript
    import { streamAgentFilterGenerator } from  "@graphai/stream_agent_filters";
    
    return async (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");

      const callback = (context: AgentFunctionContext, token: string) => {
        if (token) {
          res.write(token);
        }
      };
      const streamAgentFilter = {
        name: "streamAgentFilter",
        agent: streamAgentFilterGenerator<string>(callback),
      };
      const agentFilters = [streamAgentFilter]

      const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
      const result = await agentFilterRunner(context, agent.agent);

      const json_data = JSON.stringify(result);
      res.write("___END___");
      res.write(json_data);
      return res.end();
   }
```

### web client

https://github.com/isamu/graphai-stream-web/blob/main/src/views/Home.vue

```typescript
import { streamAgentFilterGenerator } from  "@graphai/stream_agent_filters";

const useAgentFilter = (callback: (context: AgentFunctionContext, data: T) => void) => {
  const streamAgentFilter = streamAgentFilterGenerator(callback);

  const agentFilters = [
    {
      name: "streamAgentFilter",
      agent: streamAgentFilter,
      agentIds: streamAgents,
    },
  ];
  return agentFilters;
};   

export default defineComponent({
  setup() {
    const streamingData = ref<Record<string, unknown>>({});

    const callback = (context: AgentFunctionContext, data: string) => {
      const { nodeId } = context.debugInfo;
      streamingData.value[nodeId] = (streamingData.value[nodeId] ?? "") + data;
    };
    const agentFilters = useAgentFilter(callback);
    
    const graphai = new GraphAI(graphData, agents, { agentFilters });
  }
})
```
