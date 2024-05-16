"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqAgent = void 0;
const groq_sdk_1 = require("groq-sdk");
const utils_1 = require("../../utils/utils");
const groq = process.env.GROQ_API_KEY ? new groq_sdk_1.Groq({ apiKey: process.env.GROQ_API_KEY }) : undefined;
//
// This agent takes two optional inputs, and following parameters.
// inputs:
// - [0]: query string (typically from the user), optional
// - [1]: array of messages from previous conversation, optional
//
// params:
// - model: LLM model (Llama3-8b-8192, Llama3-70b-8192, Mixtral-8x7b-32768), required.
// - query: Additional query string from the app to prepend the query from the user, optional.
// - system: System prompt (ignored if inputs[1] is specified), optional
// - tools: Function definitions, optional
// - tool_choice: Tool choice parameter, optional (default = "auto")
// - temperature: Controls randomness of responses, optional (default = 0.7)
// - max_tokens: The maximum number of tokens that the model can process in a single response, optional.
// - verbose: dumps the message array to the debug console, before sending it the LLM.
//
// https://console.groq.com/docs/quickstart
//
const groqAgent = async ({ params, inputs, filterParams }) => {
    (0, utils_1.assert)(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
    const { verbose, query, system, tools, tool_choice, max_tokens, temperature, isStreaming } = params;
    const [input_query, previous_messages] = inputs;
    // Notice that we ignore params.system if previous_message exists.
    const messages = previous_messages && Array.isArray(previous_messages) ? previous_messages : system ? [{ role: "system", content: system }] : [];
    const content = (query ? [query] : []).concat(input_query && typeof input_query === "string" ? [input_query] : []).join("\n");
    if (content) {
        messages.push({
            role: "user",
            content,
        });
    }
    if (verbose) {
        console.log(messages);
    }
    const streamOption = {
        messages,
        model: params.model,
        temperature: temperature ?? 0.7,
        stream: true,
    };
    const nonStreamOption = {
        messages,
        model: params.model,
        temperature: temperature ?? 0.7,
    };
    const options = isStreaming ? streamOption : nonStreamOption;
    if (max_tokens) {
        options.max_tokens = max_tokens;
    }
    if (tools) {
        options.tools = tools;
        options.tool_choice = tool_choice ?? "auto";
    }
    if (!options.stream) {
        const result = await groq.chat.completions.create(options);
        return result;
    }
    // streaming
    const stream = await groq.chat.completions.create(options);
    let lastMessage = null;
    const contents = [];
    for await (const message of stream) {
        const token = message.choices[0].delta.content;
        if (token) {
            if (filterParams && filterParams.streamTokenCallback) {
                filterParams.streamTokenCallback(token);
            }
            contents.push(token);
        }
        lastMessage = message;
    }
    if (lastMessage) {
        lastMessage.choices[0]["message"] = [{ role: "assistant", content: contents.join("") }];
    }
    return lastMessage;
};
exports.groqAgent = groqAgent;
const groqAgentInfo = {
    name: "groqAgent",
    agent: exports.groqAgent,
    mock: exports.groqAgent,
    samples: [],
    description: "Groq Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = groqAgentInfo;
