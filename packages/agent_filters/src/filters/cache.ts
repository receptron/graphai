import { AgentFilterFunction } from "graphai";

type CacheAgentFilterSetCache = (key: string, data: any) => Promise<void>;
type CacheAgentFilterGetCache = (key: string) => Promise<any>;

// There are two types of cache
//  - pureAgent whose results are always the same for each input
//  - impureAgent with different results for inputs. For example, reading a file.
// pureAgent performs caching within agent filter. impureAgent implements a cache mechanism on the agent side.
// Actual cache reading/writing function is given to cacheAgentFilterGenerator

export const cacheAgentFilterGenerator = (cacheRepository: { setCache: CacheAgentFilterSetCache; getCache: CacheAgentFilterGetCache }) => {
  const { getCache, setCache } = cacheRepository;
  const cacheAgentFilter: AgentFilterFunction = async (context, next) => {
    const { namedInputs, params } = context;
    if (context.cacheType === "pureAgent") {
      const cacheKey = JSON.stringify({ namedInputs, params });
      const cache = await getCache(cacheKey);
      if (cache) {
        return cache;
      }
      const result = await next(context);
      await setCache(cacheKey, result);
      return result;
    }

    if (context.cacheType === "impureAgent") {
      context.filterParams.cache = {
        getCache,
        setCache,
      };
    }
    return next(context);
  };
  return cacheAgentFilter;
};
