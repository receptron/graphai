import Ajv from 'ajv';

const streamAgentFilterGenerator = (callback) => {
    const streamAgentFilter = async (context, next) => {
        if (context.debugInfo.isResult) {
            context.filterParams.streamTokenCallback = (data) => {
                callback(context, data);
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
    const { params, inputs, namedInputs, debugInfo, filterParams } = postData;
    const postBody = { params, inputs, debugInfo, filterParams, namedInputs };
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
    const { params, inputs, debugInfo, filterParams, namedInputs } = context;
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
            inputs,
            debugInfo,
            filterParams,
            namedInputs,
        };
        if (isStreaming) {
            return await streamingRequest(context, url, postData, isDebug);
        }
        return await httpRequest(url, postData);
    }
    return next(context);
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

export { agentFilterRunnerBuilder, agentInputValidator, httpAgentFilter, namedInputValidatorFilter, streamAgentFilterGenerator };
//# sourceMappingURL=bundle.esm.js.map
