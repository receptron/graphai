import { AgentFilterFunction } from "graphai";
type CacheAgentFilterSetCache = (key: string, data: any) => Promise<void>;
type CacheAgentFilterGetCache = (key: string) => Promise<any>;
export declare const sortObjectKeys: (data: any[] | Record<string, any> | string | number | boolean) => any;
export declare const cacheAgentFilterGenerator: (cacheRepository: {
    setCache: CacheAgentFilterSetCache;
    getCache: CacheAgentFilterGetCache;
}) => AgentFilterFunction;
export {};
