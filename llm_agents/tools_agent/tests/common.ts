import { agentInfoWrapper, type AgentFunction } from "graphai";

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

export const toolsTestAgent = agentInfoWrapper(toolsTestDummyAgent);
