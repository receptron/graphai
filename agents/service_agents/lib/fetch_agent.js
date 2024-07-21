"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAgent = void 0;
const xml2js_1 = require("xml2js");
const fetchAgent = async ({ namedInputs, params }) => {
    const { url, method, queryParams, headers, body } = namedInputs;
    const url0 = new URL(url);
    const headers0 = headers ? { ...headers } : {};
    if (queryParams) {
        const params = new URLSearchParams(queryParams);
        url0.search = params.toString();
    }
    if (body) {
        headers0["Content-Type"] = "application/json";
    }
    const fetchOptions = {
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
        }
        else if (type === "xml") {
            const xmlData = await response.text();
            return await (0, xml2js_1.parseStringPromise)(xmlData, { explicitArray: false, mergeAttrs: true });
        }
        else if (type === "text") {
            return response.text();
        }
        throw new Error(`Unknown Type! ${type}`);
    })();
    return result;
};
exports.fetchAgent = fetchAgent;
const fetchAgentInfo = {
    name: "fetchAgent",
    agent: exports.fetchAgent,
    mock: exports.fetchAgent,
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
exports.default = fetchAgentInfo;
