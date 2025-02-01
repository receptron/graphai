import { AgentFilterFunction, AgentFunctionContext, isObject } from "graphai";

async function* streamChatCompletion(url: string, postData: AgentFunctionContext, userHeaders: any) {
  const { params, namedInputs, debugInfo, filterParams } = postData;
  const postBody = { params, debugInfo, filterParams, namedInputs };
  const headers = { ...userHeaders, "Content-Type": "application/json" };

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
    } else {
      const token = decoder.decode(value, { stream: true });
      yield token;
    }
  }
}

const streamingRequest = async (context: AgentFunctionContext, url: string, postData: AgentFunctionContext, userHeaders: any, isDebug: boolean | undefined) => {
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
const httpRequest = async (url: string, postData: AgentFunctionContext, userHeaders: any) => {
  const headers = { ...userHeaders, "Content-Type": "application/json" };
  const response = await fetch(url, {
    method: "post",
    headers,
    body: JSON.stringify(postData),
  });
  return await response.json();
};

export const httpAgentFilter: AgentFilterFunction = async (context, next) => {
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
