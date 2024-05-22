import { AgentFunction } from "@/index";
import { parseStringPromise } from "xml2js";

export const fetchAgent: AgentFunction<{ debug?: boolean; type?: string; }, any, any> = async ({ inputs, params }) => {
  const [baseUrl, queryParams, baseHeaders, body] = inputs;

  const url = new URL(baseUrl);
  const headers = baseHeaders ? { ...baseHeaders } : {};

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url.search = params.toString();
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method: body ? "POST" : "GET",
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  };

  if (params?.debug) {
    return {
      url: url.toString(),
      method: fetchOptions.method,
      headers,
      body: fetchOptions.body,
    };
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    const status = response.status;
    const type = params?.type ?? "json";
    const error = type === "json" ? await response.json() : await response.text();
    return {
      onError: {
        message: `HTTP error: ${status}`,
        status,
        error
      }
    };
  }

  const result = await (async () => {
    const type = params?.type ?? "json";
    if (type === "json") {
      return await response.json();
    } else if (type === "xml") {
      const xmlData = await response.text();
      return await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true });
    } else if (type === "text") {
      return response.text();
    }
    throw new Error(`Unknown Type! ${type}`);
  })();

  return result;
};

const fetchAgentInfo = {
  name: "fetchAgent",
  agent: fetchAgent,
  mock: fetchAgent,
  samples: [
    {
      inputs: ["https://www.google.com", { foo: "bar" }, { "x-myHeader": "secret" }],
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
      inputs: ["https://www.google.com", undefined, undefined, { foo: "bar" }],
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
export default fetchAgentInfo;
