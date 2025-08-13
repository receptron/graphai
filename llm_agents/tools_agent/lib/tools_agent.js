"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@graphai/vanilla/lib/generator");
const toolWorkFlowStep = {
    version: 0.5,
    nodes: {
        passthrough: { value: {} },
        llmCallWithTools: {
            agent: ":llmAgent",
            isResult: true,
            params: {
                forWeb: true,
                dataStream: true,
            },
            inputs: {
                messages: ":messages",
                prompt: ":userInput.text",
                tools: ":tools",
            },
        },
        // case1. return just messages
        justTextMessagesResult: {
            unless: ":llmCallWithTools.tool.id",
            agent: "pushAgent",
            params: {
                arrayKey: "messages",
            },
            inputs: {
                array: ":messages",
                items: [":userInput.message", ":llmCallWithTools.message"],
            },
        },
        // Call agents specified in the tools result
        llmToolAgentCallMap: {
            if: ":llmCallWithTools.tool_calls",
            agent: "mapAgent",
            inputs: {
                rows: ":llmCallWithTools.tool_calls",
                passthrough: ":passthrough",
            },
            params: {
                compositeResult: true,
                rowKey: "llmToolCall",
            },
            graph: {
                version: 0.5,
                nodes: {
                    data: {
                        agent: ({ passthrough, agentName }) => {
                            if (passthrough && passthrough[agentName]) {
                                return passthrough[agentName];
                            }
                            return {};
                        },
                        inputs: {
                            passthrough: ":passthrough",
                            agentName: ":llmToolCall.name.split(--).$0",
                        },
                    },
                    toolCallAgent: {
                        isResult: true,
                        agent: ":llmToolCall.name.split(--).$0",
                        inputs: {
                            arg: ":llmToolCall.arguments",
                            func: ":llmToolCall.name.split(--).$1",
                            tool_call: ":llmToolCall",
                            data: ":data",
                        },
                    },
                    toolsAgentResponseMessage: {
                        isResult: true,
                        agent: "copyAgent",
                        inputs: {
                            role: "tool",
                            tool_call_id: ":llmToolCall.id",
                            name: ":llmToolCall.name",
                            content: ":toolCallAgent.content",
                            extra: {
                                agent: ":llmToolCall.name.split(--).$0",
                                arg: ":llmToolCall.arguments",
                                func: ":llmToolCall.name.split(--).$1",
                            },
                        },
                    },
                },
            },
        },
        // tools response if hasNext in response.
        toolsMessage: {
            agent: "pushAgent",
            inputs: {
                array: [":userInput.message", ":llmCallWithTools.message"],
                items: ":llmToolAgentCallMap.toolsAgentResponseMessage",
            },
        },
        toLLMToolCallAgentResponse: {
            agent: "nestedAgent",
            inputs: {
                llmAgent: ":llmAgent",
                toolsAgentResponse: ":llmToolAgentCallMap.toolCallAgent",
                toolsMessages: ":toolsMessage.array",
            },
            graph: {
                nodes: {
                    skipNext: {
                        agent: (namedInputs) => {
                            return namedInputs.array.some((ele) => ele.skipNext);
                        },
                        inputs: {
                            array: ":toolsAgentResponse",
                        },
                    },
                    // next llm flow
                    toolsResponseLLM: {
                        unless: ":skipNext",
                        agent: ":llmAgent",
                        isResult: true,
                        params: {
                            forWeb: true,
                            dataStream: true,
                        },
                        inputs: { messages: ":toolsMessages" },
                    },
                    toolsResponseMessages: {
                        agent: "pushAgent",
                        inputs: {
                            array: ":toolsMessages",
                            item: ":toolsResponseLLM.message",
                        },
                    },
                    // no llm flow, just return tools response
                    skipToolsResponseLLM: {
                        if: ":skipNext",
                        agent: "copyAgent",
                        inputs: {
                            array: ":toolsMessages",
                        },
                    },
                    choiceToolsResponseMessages: {
                        isResult: true,
                        agent: "arrayFindFirstExistsAgent",
                        anyInput: true,
                        inputs: {
                            array: [":toolsResponseMessages.array", ":skipToolsResponseLLM.array"],
                        },
                    },
                },
            },
        },
        mergedData: {
            inputs: {
                data: ":llmToolAgentCallMap.toolCallAgent",
                llmToolCalls: ":llmCallWithTools.tool_calls",
            },
            agent: ({ llmToolCalls, data }) => {
                const ret = {};
                llmToolCalls.forEach((tool, index) => {
                    const { name } = tool;
                    ret[name] = data[index];
                });
                return ret;
            },
        },
        toolsResult: {
            agent: "pushAgent",
            params: {
                arrayKey: "messages",
            },
            inputs: {
                array: ":messages",
                items: ":toLLMToolCallAgentResponse.choiceToolsResponseMessages",
                data: ":mergedData",
            },
        },
        result: {
            isResult: true,
            anyInput: true,
            agent: "arrayFindFirstExistsAgent",
            inputs: { array: [":justTextMessagesResult", ":toolsResult"] },
        },
    },
};
const toolsAgent = (0, generator_1.nestedAgentGenerator)(toolWorkFlowStep, { resultNodeId: "result" });
const toolsAgentInfo = {
    name: "toolsAgent",
    agent: toolsAgent,
    mock: toolsAgent,
    samples: [
        {
            inputs: {
                llmAgent: "openAIAgent",
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "lightAgent--toggleLight",
                            description: "Switch of light",
                            parameters: {
                                type: "object",
                                properties: {
                                    switch: {
                                        type: "boolean",
                                        description: "change light state",
                                    },
                                },
                            },
                        },
                    },
                ],
                messages: [
                    {
                        role: "system",
                        content: "You are a light switch. Please follow the user's instructions.",
                    },
                ],
                userInput: {
                    text: "turn on the light.",
                    message: {
                        role: "user",
                        content: "turn on the light.",
                    },
                },
            },
            params: {},
            result: "",
        },
    ],
    description: "",
    category: [],
    author: "",
    repository: "",
    source: "https://github.com/receptron/graphai/blob/main/llm_agents/tools_agent/src/tools_agent.ts",
    package: "@graphai/tools_agent",
    license: "",
    hasGraphData: true,
};
exports.default = toolsAgentInfo;
