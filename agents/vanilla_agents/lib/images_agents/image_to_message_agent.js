"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.images2messageAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
// https://platform.openai.com/docs/guides/vision
const getImageUrl = (data, imageType, detail) => {
    if (imageType === "http") {
        return {
            url: data,
        };
    }
    const dataUrl = `data:image/${imageType};base64,${data}`;
    return {
        url: dataUrl,
        detail: detail ?? "auto",
    };
};
const images2messageAgent = async ({ namedInputs, params }) => {
    const { imageType, detail } = params;
    const { array, prompt } = namedInputs;
    (0, agent_utils_1.arrayValidate)("images2messageAgent", namedInputs);
    (0, graphai_1.assert)(!!imageType, "images2messageAgent: params.imageType is UNDEFINED! Set Type: png, jpg...");
    const contents = array.map((base64ImageData) => {
        const image_url = getImageUrl(base64ImageData, imageType, detail);
        return {
            type: "image_url",
            image_url,
        };
    });
    if (prompt) {
        contents.unshift({ type: "text", text: prompt });
    }
    return {
        message: {
            role: "user",
            content: contents,
        },
    };
};
exports.images2messageAgent = images2messageAgent;
const images2messageAgentInfo = {
    name: "images2messageAgent",
    agent: exports.images2messageAgent,
    mock: exports.images2messageAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array of base64 image data",
            },
            prompt: {
                type: "string",
                description: "prompt message",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: ["abcabc", "122123"] },
            params: { imageType: "png" },
            result: {
                message: {
                    content: [
                        {
                            image_url: {
                                detail: "auto",
                                url: "data:image/png;base64,abcabc",
                            },
                            type: "image_url",
                        },
                        {
                            image_url: {
                                detail: "auto",
                                url: "data:image/png;base64,122123",
                            },
                            type: "image_url",
                        },
                    ],
                    role: "user",
                },
            },
        },
        {
            inputs: { array: ["abcabc", "122123"], prompt: "hello" },
            params: { imageType: "jpg", detail: "high" },
            result: {
                message: {
                    content: [
                        {
                            type: "text",
                            text: "hello",
                        },
                        {
                            image_url: {
                                detail: "high",
                                url: "data:image/jpg;base64,abcabc",
                            },
                            type: "image_url",
                        },
                        {
                            image_url: {
                                detail: "high",
                                url: "data:image/jpg;base64,122123",
                            },
                            type: "image_url",
                        },
                    ],
                    role: "user",
                },
            },
        },
        {
            inputs: { array: ["http://example.com/1.jpg", "http://example.com/2.jpg"] },
            params: { imageType: "http" },
            result: {
                message: {
                    content: [
                        {
                            image_url: {
                                url: "http://example.com/1.jpg",
                            },
                            type: "image_url",
                        },
                        {
                            image_url: {
                                url: "http://example.com/2.jpg",
                            },
                            type: "image_url",
                        },
                    ],
                    role: "user",
                },
            },
        },
    ],
    description: "Returns the message data for llm include image",
    category: ["image"],
    author: "Receptron team",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};
exports.default = images2messageAgentInfo;
