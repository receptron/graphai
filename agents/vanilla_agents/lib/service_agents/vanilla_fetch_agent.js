"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vanillaFetchAgent = void 0;
const graphai_1 = require("graphai");
const allowedMethods = ["GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "PATCH" /* "TRACE" */];
const methodsRequiringBody = ["POST", "PUT", "PATCH"];
const vanillaFetchAgent = async ({ namedInputs, params, }) => {
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
    const fetchOptions = {
        method: method ?? (body ? "POST" : "GET"),
        headers: new Headers(headers0),
        body: body ? JSON.stringify(body) : undefined,
    };
    (0, graphai_1.assert)(allowedMethods.includes(fetchOptions.method ?? ""), "fetchAgent: invalid method: " + fetchOptions.method);
    (0, graphai_1.assert)(!methodsRequiringBody.includes(fetchOptions.method ?? "") || !!body, "fetchAgent: The request body is required for this method: " + fetchOptions.method);
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
        }
        else if (type === "text") {
            return response.text();
        }
        throw new Error(`Unknown Type! ${type}`);
    })();
    return result;
};
exports.vanillaFetchAgent = vanillaFetchAgent;
const vanillaFetchAgentInfo = {
    name: "vanillaFetchAgent",
    agent: exports.vanillaFetchAgent,
    mock: exports.vanillaFetchAgent,
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
    ],
    description: "Retrieves JSON data from the specified URL",
    category: ["service"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = vanillaFetchAgentInfo;
