import "dotenv/config";
import { defaultTestContext } from "graphai";
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
    };
  }
  if (func === "textSpeach") {
    return {
      content: "speech",
      hasNext: true,
    };
  }
  return {};
};
const toolsTestAgent = agentInfoWrapper(toolsTestDummyAgent);

const llmDummy: AgentFunction = async ({ namedInputs }) => {
  const { messages, prompt, tools } = namedInputs;

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
        arguments: { location: "hello" },
      };
    }
  })();

  return {
    message: {
      role: "assistant",
      tool_calls: [tool],
    },
    tool,
    tool_calls: [tool],
  };
};
const llmAgent = agentInfoWrapper(llmDummy);

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
          // userInput: { text: "test1"},
          userInput: { text: "testWithNext" },
          tools: [{}],
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
          hasNext: true,
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
                location: "hello",
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
              location: "hello",
            },
            func: "textSpeach",
          },
        },
        {
          role: "assistant",
          tool_calls: [],
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
          tools: [{}],
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
