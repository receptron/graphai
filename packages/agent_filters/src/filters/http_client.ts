import { AgentFilterFunction, AgentFunctionContext } from "graphai";

async function* streamChatCompletion(url: string, postData: AgentFunctionContext) {
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
    } else {
      const token = decoder.decode(value, { stream: true });
      yield token;
    }
  }
}

const streamingRequest = async (context: AgentFunctionContext, url: string, postData: AgentFunctionContext, isDebug: boolean | undefined) => {
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
const httpRequest = async (url: string, postData: AgentFunctionContext) => {
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  return await response.json();
};

export const httpAgentFilter: AgentFilterFunction = async (context, next) => {
  const { params, inputs, debugInfo, filterParams, namedInputs } = context;

  if (filterParams?.server) {
    const { baseUrl, isDebug, serverAgentUrlDictionary } = filterParams.server;
    const agentId = debugInfo.agentId;
    const isStreaming = filterParams.streamTokenCallback !== undefined;
    const url = serverAgentUrlDictionary && serverAgentUrlDictionary[agentId] ? serverAgentUrlDictionary[agentId] : [baseUrl, agentId].join("/");
    if (url === undefined) {
      console.log("httpAgentFilter: Url is not defined")
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
