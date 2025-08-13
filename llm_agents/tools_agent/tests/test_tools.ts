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
      skipNext: true,
    };
  }
  if (func === "textSpeach") {
    return {
      content: "speech",
    };
  }
  return {};
};
const toolsTestAgent = agentInfoWrapper(toolsTestDummyAgent);

const llmDummy: AgentFunction = async ({ namedInputs }) => {
  const { prompt, messages } = namedInputs;

  const tool = (() => {
    if (prompt === "test1") {
      return {
        id: "call_1",
        name: "toolsTestAgent--getWeather",
        arguments: { location: "Tokyo" },
      };
    }
    if (prompt === "testWithNext") {
      return {
        id: "call_2",
        name: "toolsTestAgent--textSpeach",
        arguments: { location: "hello tokyo!!" },
      };
    }
    return null;
  })();

  if (tool) {
    return {
      message: {
        role: "assistant",
        tool_calls: [tool],
      },
      tool,
      tool_calls: [tool],
    };
  }
  if (messages.length > 0 && messages[messages.length - 1].role === "tool") {
    return {
      message: {
        role: "assistant",
        content: "tool",
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
          role: "assistant",
        },
      ],
    },
  };
  assert.deepStrictEqual(expect, res);
});

test("test tools with next", async () => {
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
          userInput: { text: "testWithNext" },
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
      data: {
        "toolsTestAgent--textSpeach": {
          content: "speech",
        },
      },
      messages: [
        {
          role: "assistant",
          tool_calls: [
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
          tool_call_id: "call_2",
          name: "toolsTestAgent--textSpeach",
          content: "speech",
          extra: {
            agent: "toolsTestAgent",
            arg: {
              location: "hello tokyo!!",
            },
            func: "textSpeach",
          },
        },
        {
          role: "assistant",
          content: "tool",
        },
      ],
    },
  };
  assert.deepStrictEqual(expect, res);
});

test("test tools", async () => {
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
  console.log(JSON.stringify(res, null, 2));
  const expect = {
    tools: {
      data: {
        "toolsTestAgent--getWeather": {
          content: "getWeather Tokyo",
          skipNext: true
        },
      },
      messages: [
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
            func: "getWeather",
          },
        },
      ],
    },
  };
  assert.deepStrictEqual(expect, res);
});
