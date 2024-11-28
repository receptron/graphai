import { AgentFilterFunction, isObject } from "graphai";

type CacheAgentFilterSetCache = (key: string, data: any) => Promise<void>;
type CacheAgentFilterGetCache = (key: string) => Promise<any>;

// for cache key, sort object key
export const sortObjectKeys = (data: any[] | Record<string, any> | string | number | boolean): any => {
  if (Array.isArray(data)) {
    return data.map((d) => sortObjectKeys(d));
  }
  if (isObject(data)) {
    return Object.keys(data)
      .sort()
      .reduce((tmp: Record<string, any>, key: string) => {
        tmp[key] = data[key];
        return tmp;
      }, {});
  }
  return data;
};

// There are two types of cache
//  - pureAgent whose results are always the same for each input
//  - impureAgent with different results for the same inputs. For example, reading a file.
// pureAgent performs caching within agent filter. impureAgent with different results for the same inputs. For example, reading a file.
// impureAgent implements a cache mechanism on the agent side.
// Actual cache reading/writing function is given to cacheAgentFilterGenerator

export const cacheAgentFilterGenerator = (cacheRepository: { setCache: CacheAgentFilterSetCache; getCache: CacheAgentFilterGetCache }) => {
  const { getCache, setCache } = cacheRepository;
  const cacheAgentFilter: AgentFilterFunction = async (context, next) => {
    const { namedInputs, params, debugInfo } = context;
    if (context.cacheType === "pureAgent") {
      const { agentId } = debugInfo;
      const cacheKey = JSON.stringify(sortObjectKeys({ namedInputs, params, agentId }));
      const cache = await getCache(cacheKey);
      if (cache) {
        return cache;
      }
      const result = await next(context);
      await setCache(cacheKey, JSON.stringify(result));
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
