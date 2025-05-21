# @graphai/cache_agent_filter for GraphAI

Cache Agent filter for GraphAI.

## Install

```
yarn add @graphai/cache_agent_filter
```

### USAGE

```
import { cacheAgentFilterGenerator } from "@graphai/cache_agent_filter";

const setCache = async (key: string, data: any) => {
  ...
  return;
};
const getCache = async (key: string) => {
  ...
  return data;
}

const cacheAgentFilter = cacheAgentFilterGenerator({ getCache, setCache });
```
