export * from '@graphai/stream_agent_filters';
import Ajv from 'ajv';
import { isObject } from 'graphai';
import { sha256 } from '@noble/hashes/sha2';
import input from '@inquirer/input';

// export for test
const agentInputValidator = (inputSchema, namedInputs, nodeId, agentId) => {
    const ajv = new Ajv();
    const validateSchema = ajv.compile(inputSchema);
    if (!validateSchema(namedInputs)) {
        // console.log(validateSchema.errors);
        throw new Error(`${nodeId}(${agentId ?? "func"}) schema not matched`);
    }
    return true;
};
const namedInputValidatorFilter = async (context, next) => {
    const { inputSchema, namedInputs } = context;
    const { agentId, nodeId } = context.debugInfo;
    if (inputSchema) {
        if (inputSchema.type !== "array") {
            agentInputValidator(inputSchema, namedInputs || {}, nodeId, agentId);
        }
    }
    return next(context);
};

async function* streamChatCompletion(url, postData, userHeaders) {
    const { params, namedInputs, debugInfo, filterParams } = postData;
    const postBody = { params, debugInfo, filterParams, namedInputs };
    const headers = { ...userHeaders, "Content-Type": "text/event-stream" };
    const completion = await fetch(url, {
        headers,
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
const streamingRequest = async (context, url, postData, userHeaders, isDebug) => {
    const generator = streamChatCompletion(url, postData, userHeaders);
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
const httpRequest = async (url, postData, userHeaders) => {
    const headers = { ...userHeaders, "Content-Type": "application/json" };
    const response = await fetch(url, {
        method: "post",
        headers,
        body: JSON.stringify(postData),
    });
    return await response.json();
};
const httpAgentFilter = async (context, next) => {
    const { params, debugInfo, filterParams, namedInputs, config } = context;
    if (filterParams?.server) {
        const { baseUrl, isDebug, serverAgentUrlDictionary } = filterParams.server;
        const headers = config?.headers ?? {};
        if (!isObject(headers)) {
            throw new Error("httpAgentFilter: headers is not object.");
        }
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
            return await streamingRequest(context, url, postData, headers, isDebug);
        }
        return await httpRequest(url, postData, headers);
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
        if (context.cacheType === "pureAgent" || context.cacheType === undefined) {
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

const stepRunnerGenerator = (awaitStep) => {
    const stepRunnerFilter = async (context, next) => {
        const result = await next(context);
        await awaitStep(context, result);
        return result;
    };
    return stepRunnerFilter;
};

const awaitStep = async (context, result) => {
    const { params, namedInputs, debugInfo } = context;
    const { nodeId, agentId, retry, state } = debugInfo;
    console.log({ nodeId, agentId, params, namedInputs, result, state, retry });
    const message = "Puress enter to next";
    await input({ message: message });
};
const consoleStepRunner = stepRunnerGenerator(awaitStep);

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

export { agentFilterRunnerBuilder, agentInputValidator, cacheAgentFilterGenerator, consoleStepRunner, httpAgentFilter, namedInputValidatorFilter, sortObjectKeys, stepRunnerGenerator };
//# sourceMappingURL=bundle.esm.js.map
