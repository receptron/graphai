import { NodeState, isObject } from 'graphai';
import Ajv from 'ajv';
import { sha256 } from '@noble/hashes/sha2';

const streamAgentFilterGenerator = (callback) => {
    const streamAgentFilter = async (context, next) => {
        if (context.debugInfo.isResult) {
            context.filterParams.streamTokenCallback = (data) => {
                if (context.debugInfo.state === NodeState.Executing) {
                    callback(context, data);
                }
            };
        }
        return next(context);
    };
    return streamAgentFilter;
};

// export for test
const agentInputValidator = (inputSchema, namedInputs) => {
    const ajv = new Ajv();
    const validateSchema = ajv.compile(inputSchema);
    if (!validateSchema(namedInputs)) {
        // console.log(validateSchema.errors);
        throw new Error("schema not matched");
    }
    return true;
};
const namedInputValidatorFilter = async (context, next) => {
    const { inputSchema, namedInputs } = context;
    if (inputSchema) {
        if (inputSchema.type !== "array") {
            agentInputValidator(inputSchema, namedInputs || {});
        }
    }
    return next(context);
};

async function* streamChatCompletion(url, postData) {
    const { params, namedInputs, debugInfo, filterParams } = postData;
    const postBody = { params, debugInfo, filterParams, namedInputs };
    const completion = await fetch(url, {
        headers: {
            "Content-Type": "text/event-stream",
        },
        method: "POST",
        body: JSON.stringify(postBody),
    });
    const reader = completion.body?.getReader();
    if (completion.status !== 200 || !reader) {
        throw new Error("Request failed");
    }
    const decoder = new TextDecoder("utf-8");
    let done = false;
    while (!done) {
        const { done: readDone, value } = await reader.read();
        if (readDone) {
            done = readDone;
            reader.releaseLock();
        }
        else {
            const token = decoder.decode(value, { stream: true });
            yield token;
        }
    }
}
const streamingRequest = async (context, url, postData, isDebug) => {
    const generator = streamChatCompletion(url, postData);
    const messages = [];
    for await (const token of generator) {
        if (isDebug) {
            console.log(token);
        }
        // callback to stream filter
        if (token) {
            messages.push(token);
            if (messages.join("").indexOf("___END___") === -1 && context.filterParams.streamTokenCallback) {
                context.filterParams.streamTokenCallback(token);
            }
        }
    }
    const payload_data = messages.join("").split("___END___")[1];
    const data = JSON.parse(payload_data);
    return data;
};
const httpRequest = async (url, postData) => {
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    });
    return await response.json();
};
const httpAgentFilter = async (context, next) => {
    const { params, debugInfo, filterParams, namedInputs } = context;
    if (filterParams?.server) {
        const { baseUrl, isDebug, serverAgentUrlDictionary } = filterParams.server;
        const agentId = debugInfo.agentId;
        const isStreaming = filterParams.streamTokenCallback !== undefined;
        const url = serverAgentUrlDictionary && agentId && serverAgentUrlDictionary[agentId] ? serverAgentUrlDictionary[agentId] : [baseUrl, agentId].join("/");
        if (url === undefined) {
            console.log("httpAgentFilter: Url is not defined");
        }
        const postData = {
            params,
            debugInfo,
            filterParams,
            namedInputs,
            inputs: namedInputs, // alias.
        };
        if (isStreaming) {
            return await streamingRequest(context, url, postData, isDebug);
        }
        return await httpRequest(url, postData);
    }
    return next(context);
};

// for cache key, sort object key
const sortObjectKeys = (data) => {
    if (Array.isArray(data)) {
        return data.map((d) => sortObjectKeys(d));
    }
    if (isObject(data)) {
        return Object.keys(data)
            .sort()
            .reduce((tmp, key) => {
            tmp[key] = data[key];
            return tmp;
        }, {});
    }
    return data;
};
const getDefaultCacheKey = (context) => {
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

// for test and server.
const agentFilterRunnerBuilder = (__agentFilters) => {
    const agentFilters = __agentFilters;
    const agentFilterRunner = (context, agent) => {
        let index = 0;
        const next = (context) => {
            const agentFilter = agentFilters[index++];
            if (agentFilter) {
                return agentFilter.agent(context, next);
            }
            return agent(context);
        };
        return next(context);
    };
    return agentFilterRunner;
};

export { agentFilterRunnerBuilder, agentInputValidator, cacheAgentFilterGenerator, httpAgentFilter, namedInputValidatorFilter, sortObjectKeys, streamAgentFilterGenerator };
//# sourceMappingURL=bundle.esm.js.map
