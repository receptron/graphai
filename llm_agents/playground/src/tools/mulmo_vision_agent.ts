import { type AgentFunctionInfo, type AgentFunction } from "graphai";
import { functionNameToTemplateName, tools, convertTools } from "mulmocast-vision/lib/browser";

const mulmoVisionTools = convertTools(tools);

const mulmoVisionAgent: AgentFunction = async ({ namedInputs }) => {
  const { arg, func } = namedInputs;
  const { talkTrack, ...newArg } = arg;

  const beat = {
    id: crypto.randomUUID(),
    speaker: "Presenter",
    text: talkTrack ?? "",
    image: {
      type: "vision",
      style: functionNameToTemplateName(func),
      data: newArg,
    },
  };

  return {
    content: "Successfully created",
    data: beat,
  };
};

export const mulmoVisionAgentInfo: AgentFunctionInfo = {
  name: "mulmoVisionAgent",
  agent: mulmoVisionAgent,
  mock: mulmoVisionAgent,
  samples: [
    {
      params: {},
      inputs: {},
      result: {},
    },
  ],
  tools: mulmoVisionTools,
  description: "generate mulmo script json data from prompt messages",
  category: ["net"],
  author: "Receptron team",
  repository: "https://github.com/receptron/mulmocast-app",
  license: "MIT",
};

export default mulmoVisionAgentInfo;
