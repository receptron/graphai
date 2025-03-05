import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import type { GraphAIDebug, GraphAIThrowError } from "@graphai/agent_utils";

type FetchParam = {
  url: string;
  method?: string;
  queryParams: any;
  headers: any;
  body: unknown;
};
const allowedMethods = ["GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "PATCH" /* "TRACE" */];
const methodsRequiringBody = ["POST", "PUT", "PATCH"];

export const vanillaFetchAgent: AgentFunction<Partial<FetchParam & GraphAIDebug & GraphAIThrowError & { type: string }>, unknown, FetchParam> = async ({
  namedInputs,
  params,
}) => {
  const { url, method, queryParams, body } = {
    ...params,
    ...namedInputs,
  };
  const throwError = params.throwError ?? false;

  const url0 = new URL(url);
  const headers0 = {
    ...(params.headers ? params.headers : {}),
    ...(namedInputs.headers ? namedInputs.headers : {}),
  };

  if (queryParams) {
    const _params = new URLSearchParams(queryParams);
    url0.search = _params.toString();
  }

  if (body) {
    headers0["Content-Type"] = "application/json";
  }

  //
  const fetchOptions: RequestInit = {
    method: method ? method.toUpperCase() : body ? "POST" : "GET",
    headers: new Headers(headers0),
    body: body ? JSON.stringify(body) : undefined,
  };
  assert(allowedMethods.includes(fetchOptions.method ?? ""), "fetchAgent: invalid method: " + fetchOptions.method);
  assert(
    !methodsRequiringBody.includes(fetchOptions.method ?? "") || !!body,
    "fetchAgent: The request body is required for this method: " + fetchOptions.method,
  );

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
      inputs: { url: "https://example.com", queryParams: { foo: "bar" }, headers: { "x-myHeader": "secret" } },
      params: {
        debug: true,
      },
      result: {
        method: "GET",
        url: "https://example.com/?foo=bar",
        headers: {
          "x-myHeader": "secret",
        },
        body: undefined,
      },
    },
    {
      inputs: { url: "https://example.com", body: { foo: "bar" } },
      params: {
        debug: true,
      },
      result: {
        method: "POST",
        url: "https://example.com/",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foo: "bar" }),
      },
    },
    {
      inputs: { url: "https://example.com", body: { foo: "bar" }, method: "PUT" },
      params: {
        debug: true,
      },
      result: {
        method: "PUT",
        url: "https://example.com/",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foo: "bar" }),
      },
    },
    {
      inputs: { url: "https://example.com", method: "options" },
      params: {
        debug: true,
      },
      result: {
        method: "OPTIONS",
        url: "https://example.com/",
        headers: {},
        body: undefined,
      },
    },
    {
      inputs: {},
      params: {
        url: "https://example.com",
        body: { foo: "bar" },
        method: "PUT",
        debug: true,
      },
      result: {
        method: "PUT",
        url: "https://example.com/",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foo: "bar" }),
      },
    },
    {
      inputs: {
        method: "DELETE",
        headers: {
          authentication: "bearer XXX",
        },
      },
      params: {
        url: "https://example.com",
        body: { foo: "bar" },
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        debug: true,
      },
      result: {
        method: "DELETE",
        url: "https://example.com/",
        headers: {
          "Content-Type": "application/json",
          authentication: "bearer XXX",
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
