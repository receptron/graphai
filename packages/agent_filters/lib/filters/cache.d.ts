import { AgentFilterFunction, AgentFunctionContext } from "graphai";
type CacheAgentFilterSetCache = (key: string, data: any) => Promise<void>;
type CacheAgentFilterGetCache = (key: string) => Promise<any>;
type CacheAgentFilterGetCacheKey = (context: AgentFunctionContext) => string;
export declare const sortObjectKeys: (data: any[] | Record<string, any> | string | number | boolean) => any;
export declare const cacheAgentFilterGenerator: (cacheRepository: {
    setCache: CacheAgentFilterSetCache;
    getCache: CacheAgentFilterGetCache;
    getCacheKey?: CacheAgentFilterGetCacheKey;
}) => AgentFilterFunction;
export {};
