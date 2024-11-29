"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheAgentFilterGenerator = exports.sortObjectKeys = void 0;
const graphai_1 = require("graphai");
const sha2_1 = require("@noble/hashes/sha2");
// for cache key, sort object key
const sortObjectKeys = (data) => {
    if (Array.isArray(data)) {
        return data.map((d) => (0, exports.sortObjectKeys)(d));
    }
    if ((0, graphai_1.isObject)(data)) {
        return Object.keys(data)
            .sort()
            .reduce((tmp, key) => {
            tmp[key] = data[key];
            return tmp;
        }, {});
    }
    return data;
};
exports.sortObjectKeys = sortObjectKeys;
const getDefaultCacheKey = (context) => {
    const { namedInputs, params, debugInfo } = context;
    const { agentId } = debugInfo;
    const cacheKeySeed = (0, sha2_1.sha256)(JSON.stringify((0, exports.sortObjectKeys)({ namedInputs, params, agentId })));
    const cacheKey = btoa(String.fromCharCode(...cacheKeySeed));
    return cacheKey;
};
// There are two types of cache
//  - pureAgent whose results are always the same for each input
//  - impureAgent with different results for the same inputs. For example, reading a file.
// pureAgent performs caching within agent filter. impureAgent with different results for the same inputs. For example, reading a file.
// impureAgent implements a cache mechanism on the agent side.
// Actual cache reading/writing function is given to cacheAgentFilterGenerator
const cacheAgentFilterGenerator = (cacheRepository) => {
    const { getCache, setCache, getCacheKey } = cacheRepository;
    const cacheAgentFilter = async (context, next) => {
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
exports.cacheAgentFilterGenerator = cacheAgentFilterGenerator;
