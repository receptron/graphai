import "dotenv/config";
import { toolsAgent } from "@/index";

import { AgentFunction, AgentFunctionInfo, defaultTestContext, agentInfoWrapper } from "graphai";

import * as vanilla_agents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";

const lightFunc: AgentFunction = async ({ namedInputs }) => {
  const { arg, func } = namedInputs;
  if (func === "toggleLight") {
    if (arg.switch) {
      console.log("Light is on!!");
    } else {
      console.log("Light is on!!");
    }
  }
  return { result: "success" };
};

const lightAgent = agentInfoWrapper(lightFunc);

const main = async (agentInfo: AgentFunctionInfo) => {
  const { agent, samples, inputs: inputSchema } = agentInfo;
  for await (const sampleKey of samples.keys()) {
    const { params, inputs } = samples[sampleKey];
    await agent({
      ...defaultTestContext,
      params,
      inputSchema,
      namedInputs: inputs,
      forNestedGraph: {
        agents: { ...vanilla_agents, openAIAgent, lightAgent },
        graphOptions: {},
      },
    });
  }
};

main(toolsAgent);
