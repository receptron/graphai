import { AgentFilterFunction, AgentFunctionContext, isObject } from "graphai";
import { sha256 } from "@noble/hashes/sha2";

type CacheAgentFilterSetCache = (key: string, data: any) => Promise<void>;
type CacheAgentFilterGetCache = (key: string) => Promise<any>;
type CacheAgentFilterGetCacheKey = (context: AgentFunctionContext) => string;

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

const getDefaultCacheKey = (context: AgentFunctionContext) => {
  const { namedInputs, params, debugInfo } = context;
  const { agentId } = debugInfo;
  const cacheKeySeed = sha256(JSON.stringify(sortObjectKeys({ namedInputs, params, agentId })));
  const cacheKey = btoa(String.fromCharCode(...cacheKeySeed));
  return cacheKey;
};

// There are two types of cache
//  - pureAgent whose results are always the same for each input
//  - impureAgent with different results for the same inputs. For example, reading a file.
// pureAgent performs caching within agent filter. impureAgent with different results for the same inputs. For example, reading a file.
// impureAgent implements a cache mechanism on the agent side.
// Actual cache reading/writing function is given to cacheAgentFilterGenerator

export const cacheAgentFilterGenerator = (cacheRepository: {
  setCache: CacheAgentFilterSetCache;
  getCache: CacheAgentFilterGetCache;
  getCacheKey?: CacheAgentFilterGetCacheKey;
}) => {
  const { getCache, setCache, getCacheKey } = cacheRepository;
  const cacheAgentFilter: AgentFilterFunction = async (context, next) => {
    if (context.cacheType === "pureAgent") {
      const cacheKey = getCacheKey ? getCacheKey(context) : getDefaultCacheKey(context);
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
        getCacheKey: getDefaultCacheKey,
      };
    }
    return next(context);
  };
  return cacheAgentFilter;
};
