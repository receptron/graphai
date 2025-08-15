import "dotenv/config";
import toolsAgent from "../src/tools_agent";
import { GraphAI, agentInfoWrapper, type AgentFunction } from "graphai";
import * as agents from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

const toolsTestDummyAgent: AgentFunction = async ({ namedInputs }) => {
  const { arg, func } = namedInputs;
  if (func === "getWeather") {
    return {
      content: "getWeather " + arg.location,
      data: {
        weather: "fine",
      },
    };
  }
  if (func === "textSpeach") {
    return {
      content: "speech",
      data: {
        talk: "snow",
      },
    };
  }
  return {};
};
const toolsTestAgent = agentInfoWrapper(toolsTestDummyAgent);

const llmDummy: AgentFunction = async ({ namedInputs }) => {
  const { prompt, messages } = namedInputs;

  const tool = (() => {
    if (prompt === "test1") {
      return [
        {
          id: "call_1",
          name: "toolsTestAgent--getWeather",
          arguments: { location: "Tokyo" },
        },
      ];
    }
    if (prompt === "test2") {
      return [
        {
          id: "call_1",
          name: "toolsTestAgent--getWeather",
          arguments: { location: "Tokyo" },
        },
        {
          id: "call_2",
          name: "toolsTestAgent--textSpeach",
          arguments: { location: "hello tokyo!!" },
        },
      ];
    }
    return null;
  })();

  if (tool) {
    return {
      message: {
        role: "assistant",
        tool_calls: tool,
      },
      tool: tool[0],
      tool_calls: tool,
    };
  }
  if (messages.length > 0 && messages[messages.length - 1].role === "tool") {
    const last = messages[messages.length - 1];
    // content
    return {
      message: {
        role: "assistant",
        content: "success " + last.content,
      },
    };
  }

  return {
    message: {
      role: "assistant",
      content: "hello",
    },
  };
};
const llmAgent = agentInfoWrapper(llmDummy);

test("test tools no tools", async () => {
  const graph = {
    version: 0.5,
    nodes: {
      hoge: {
        value: true,
      },
      tools: {
        isResult: true,
        agent: "toolsAgent",
        inputs: {
          messages: [],
          userInput: { text: "hello" },
          tools: [{}], // In fact, you set the tools schema here.
          llmAgent: "llmAgent",
        },
      },
    },
  };

  const graphai = new GraphAI(graph, { ...agents, toolsAgent, toolsTestAgent, llmAgent });
  const res = await graphai.run();
  // console.log(JSON.stringify(res, null, 2));
  const expect = {
    tools: {
      messages: [
        {
          content: "hello",
          role: "user",
        },
        {
          content: "hello",
          role: "assistant",
        },
      ],
    },
  };
  assert.deepStrictEqual(expect, res);
});

test("test tools 1", async () => {
  const graph = {
    version: 0.5,
    nodes: {
      hoge: {
        value: true,
      },
      tools: {
        isResult: true,
        agent: "toolsAgent",
        inputs: {
          messages: [],
          userInput: { text: "test1" },
          tools: [{}], // In fact, you set the tools schema here.
          llmAgent: "llmAgent",
        },
      },
    },
  };

  const graphai = new GraphAI(graph, { ...agents, toolsAgent, toolsTestAgent, llmAgent });
  const res = await graphai.run();
  // console.log(JSON.stringify(res, null, 2));
  const expect = {
    tools: [
      {
        content: "test1",
        role: "user",
      },
      {
        role: "assistant",
        tool_calls: [
          {
            id: "call_1",
            name: "toolsTestAgent--getWeather",
            arguments: {
              location: "Tokyo",
            },
          },
        ],
      },
      {
        role: "tool",
        tool_call_id: "call_1",
        name: "toolsTestAgent--getWeather",
        content: "getWeather Tokyo",
        extra: {
          agent: "toolsTestAgent",
          arg: {
            location: "Tokyo",
          },
          data: {
            weather: "fine",
          },
          func: "getWeather",
        },
      },
      {
        role: "assistant",
        content: "success getWeather Tokyo",
      },
    ],
  };
  assert.deepStrictEqual(expect, res);
});

test("test tools 2", async () => {
  const graph = {
    version: 0.5,
    nodes: {
      hoge: {
        value: true,
      },
      tools: {
        isResult: true,
        agent: "toolsAgent",
        inputs: {
          messages: [],
          userInput: { text: "test2" },
          tools: [{}], // In fact, you set the tools schema here.
          llmAgent: "llmAgent",
        },
      },
    },
  };

  const graphai = new GraphAI(graph, { ...agents, toolsAgent, toolsTestAgent, llmAgent });
  const res = await graphai.run();
  // console.log(JSON.stringify(res, null, 2));
  const expect = {
    tools: [
      {
        content: "test2",
        role: "user",
      },
      {
        role: "assistant",
        tool_calls: [
          {
            id: "call_1",
            name: "toolsTestAgent--getWeather",
            arguments: { location: "Tokyo" },
          },
          {
            id: "call_2",
            name: "toolsTestAgent--textSpeach",
            arguments: {
              location: "hello tokyo!!",
            },
          },
        ],
      },
      {
        role: "tool",
        tool_call_id: "call_1",
        name: "toolsTestAgent--getWeather",
        content: "getWeather Tokyo",
        extra: {
          agent: "toolsTestAgent",
          arg: {
            location: "Tokyo",
          },
          data: {
            weather: "fine",
          },
          func: "getWeather",
        },
      },
      {
        role: "assistant",
        content: "success getWeather Tokyo",
      },
      {
        role: "tool",
        tool_call_id: "call_2",
        name: "toolsTestAgent--textSpeach",
        content: "speech",
        extra: {
          agent: "toolsTestAgent",
          arg: {
            location: "hello tokyo!!",
          },
          func: "textSpeach",
          data: {
            talk: "snow",
          },
        },
      },
      {
        role: "assistant",
        content: "success speech",
      },
    ],
  };
  assert.deepStrictEqual(expect, res);
});
