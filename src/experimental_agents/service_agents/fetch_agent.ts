import { AgentFunction } from "@/graphai";

export const fetchAgent: AgentFunction<{ debug?: boolean }, any, any> = async ({ inputs, params }) => {
  const [ baseUrl, queryParams, baseHeaders, body ] = inputs;

  const url = new URL(baseUrl);
  const headers = baseHeaders ? { ...baseHeaders } : {};

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url.search = params.toString();
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
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
      body: fetchOptions.body
    }
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

const fetchAgentInfo = {
  name: "fetchAgent",
  agent: fetchAgent,
  mock: fetchAgent,
  samples: [
    {
      inputs: ["https://www.google.com"],
      params: {
        debug: true,
      },
      result: {
        body: undefined,
        headers: {},
        method: 'GET',
        url: 'https://www.google.com/'
      },
    },
  ],
  description: "Retrieves JSON data from the specified URL",
  category: ["data"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default fetchAgentInfo;