import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import type { GraphAIDebug, GraphAISupressError, GraphAIFlatResponse } from "@graphai/agent_utils";

type FetchParam = {
  url: string;
  method?: string;
  queryParams: any;
  headers: Record<string, any>;
  body: unknown;
};
const allowedMethods = ["GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "PATCH" /* "TRACE" */];
const methodsRequiringBody = ["POST", "PUT", "PATCH"];

/*
  For compatibility, we are adding GraphAIFlatResponse to the parameters.
 By default, it is usually set to false, but it will be set to true for use in tutorials and similar cases.
 In the future, flat responses (non-object results) will be deprecated.
 Until then, we will set flatResponse to false using vanillaFetch and transition to object-based responses.
 Eventually, this option will be removed, and it will be ignored at runtime, always returning an object.
 */

export const vanillaFetchAgent: AgentFunction<
  Partial<FetchParam & GraphAIDebug & GraphAISupressError & GraphAIFlatResponse & { type: string }>,
  unknown,
  FetchParam
> = async ({ namedInputs, params, config }) => {
  const { url, method, queryParams, body } = {
    ...params,
    ...namedInputs,
  };
  assert(!!url, "fetchAgent: no url");

  const supressError = params.supressError ?? false;

  const url0 = new URL(url);
  const headers0 = {
    ...(params.headers ? params.headers : {}),
    ...(namedInputs.headers ? namedInputs.headers : {}),
  };
  if (config && config.authorization) {
    headers0["Authorization"] = config.authorization;
  }

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
    if (supressError) {
      return {
        onError: {
          message: `HTTP error: ${status}`,
          status,
          error,
        },
      };
    }
    throw new Error(`HTTP error: ${status}`);
  }

  const data = await (async () => {
    const type = params?.type ?? "json";
    if (type === "json") {
      return await response.json();
    } else if (type === "text") {
      return response.text();
    }
    throw new Error(`Unknown Type! ${type}`);
  })();

  if (params.flatResponse === false) {
    return { data };
  }
  return data;
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
        description: "The request URL. Can be provided in either 'inputs' or 'params'.",
      },
      method: {
        type: "string",
        description: "The HTTP method to use (GET, POST, PUT, etc.). Defaults to GET if not specified and no body is provided; otherwise POST.",
      },
      headers: {
        type: "object",
        description: "Optional HTTP headers to include in the request. Values from both inputs and params are merged.",
      },
      queryParams: {
        type: "object",
        description: "Optional query parameters to append to the URL.",
      },
      body: {
        description: "Optional request body to send with POST, PUT, or PATCH methods.",
        anyOf: [{ type: "string" }, { type: "object" }],
      },
    },
    required: [],
    additionalProperties: false,
  },
  params: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The request URL (overridden if also specified in inputs).",
      },
      method: {
        type: "string",
        description: "The HTTP method (overridden if also specified in inputs).",
      },
      headers: {
        type: "object",
        description: "Additional headers. Merged with inputs.headers.",
      },
      queryParams: {
        type: "object",
        description: "Query parameters to append to the URL.",
      },
      body: {
        description: "Request body to be sent, used with POST/PUT/PATCH.",
        anyOf: [{ type: "string" }, { type: "object" }],
      },
      debug: {
        type: "boolean",
        description: "If true, returns the prepared request details instead of performing the actual fetch.",
      },
      supressError: {
        type: "boolean",
        description: "If true, suppresses thrown errors and returns the error response instead.",
      },
      flatResponse: {
        type: "boolean",
        description: "If true, returns the raw response. If false, wraps the response in an object with a 'data' key. Default is false.",
      },
      type: {
        type: "string",
        enum: ["json", "text"],
        description: "Response type to parse. Either 'json' or 'text'. Defaults to 'json'.",
      },
    },
    required: [],
    additionalProperties: false,
  },
  output: {
    description:
      "Returns either the HTTP response body or a debug object. If an error occurs and 'supressError' is true, returns an object with an 'onError' key.",
    anyOf: [
      {
        type: "object",
        properties: {
          onError: {
            type: "object",
            properties: {
              message: { type: "string" },
              status: { type: "integer" },
              error: {},
            },
            required: ["message", "status", "error"],
          },
        },
        required: ["onError"],
        additionalProperties: true,
      },
      {
        type: "object",
        description: "Debug information returned when 'debug' is true.",
        properties: {
          method: { type: "string" },
          url: { type: "string" },
          headers: { type: "object" },
          body: {},
        },
        required: ["method", "url", "headers"],
      },
      {},
      {
        type: "object",
        description: "When 'flatResponse' is false, the response is wrapped as { data: ... }.",
        properties: {
          data: {},
        },
        required: ["data"],
        additionalProperties: true,
      },
    ],
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
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/service_agents/vanilla_fetch_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default vanillaFetchAgentInfo;
