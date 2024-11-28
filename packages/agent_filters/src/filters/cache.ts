import { AgentFilterFunction } from "graphai";

type SetCache = (key: string, data: any) => Promise<void>;
type GetCache = (key: string) => Promise<any>;

export const cacheAgentFilterGenerator = (cacheRepository: { setCache: SetCache; getCache: GetCache }) => {
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
        getCache: (key: string) => {
          return;
        },
        setCache: (key: string, data: any) => {},
      };
    }
    // console.log(context);
    return next(context);
  };
  return cacheAgentFilter;
};
