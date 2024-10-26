import { AgentFunction, AgentFunctionInfo } from "graphai";

export const vanillaFetchAgent: AgentFunction<{ debug?: boolean; type?: string; throwError?: boolean }, any, any> = async ({ namedInputs, params }) => {
  const { url, method, queryParams, headers, body } = namedInputs;
  const throwError = params.throwError ?? false;

  const url0 = new URL(url);
  const headers0 = headers ? { ...headers } : {};

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url0.search = params.toString();
  }

  if (body) {
    headers0["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method: (method ?? body) ? "POST" : "GET",
    headers: new Headers(headers0),
    body: body ? JSON.stringify(body) : undefined,
  };

  if (params?.debug) {
    return {
      url: url0.toString(),
      method: fetchOptions.method,
      headers: headers0,
      body: fetchOptions.body,
    };
  }

  const response = await fetch(url0.toString(), fetchOptions);

  if (!response.ok) {
    const status = response.status;
    const type = params?.type ?? "json";
    const error = type === "json" ? await response.json() : await response.text();
    if (throwError) {
      throw new Error(`HTTP error: ${status}`);
    }
    return {
      onError: {
        message: `HTTP error: ${status}`,
        status,
        error,
      },
    };
  }

  const result = await (async () => {
    const type = params?.type ?? "json";
    if (type === "json") {
      return await response.json();
    } else if (type === "text") {
      return response.text();
    }
    throw new Error(`Unknown Type! ${type}`);
  })();

  return result;
};

const vanillaFetchAgentInfo: AgentFunctionInfo = {
  name: "vanillaFetchAgent",
  agent: vanillaFetchAgent,
  mock: vanillaFetchAgent,
  inputs: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "baseurl",
      },
      method: {
        type: "string",
        description: "HTTP method",
      },
      headers: {
        type: "object",
        description: "HTTP headers",
      },
      quaryParams: {
        type: "object",
        description: "Query parameters",
      },
      body: {
        anyOf: [{ type: "string" }, { type: "object" }],
        description: "body",
      },
    },
    required: ["url"],
  },
  output: {
    type: "array",
  },
  samples: [
    {
      inputs: { url: "https://www.google.com", queryParams: { foo: "bar" }, headers: { "x-myHeader": "secret" } },
      params: {
        debug: true,
      },
      result: {
        method: "GET",
        url: "https://www.google.com/?foo=bar",
        headers: {
          "x-myHeader": "secret",
        },
        body: undefined,
      },
    },
    {
      inputs: { url: "https://www.google.com", body: { foo: "bar" } },
      params: {
        debug: true,
      },
      result: {
        method: "POST",
        url: "https://www.google.com/",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foo: "bar" }),
      },
    },
  ],
  description: "Retrieves JSON data from the specified URL",
  category: ["service"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default vanillaFetchAgentInfo;
