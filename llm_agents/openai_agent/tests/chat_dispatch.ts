import "dotenv/config";
import * as agent from "@/index";
import { textInputAgent } from "@graphai/input_agents";
import * as vanilla from "@graphai/vanilla";
import { GraphAI, GraphData, AgentFunctionInfoDictionary, DefaultResultData, ValidationError } from "graphai";

import { graphDataOpenAITools } from "./graphData";

const main = async () => {
  const graphai = new GraphAI(graphDataOpenAITools, { ...agent, textInputAgent, ...vanilla });
  await graphai.run();
};

main();
