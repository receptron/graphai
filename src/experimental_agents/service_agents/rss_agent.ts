import { AgentFunction } from "@/graphai";

export const rssAgent: AgentFunction<{ }, any, string> = async ({ inputs }) => {
  const url = inputs[0];
  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    return xmlData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const rssAgentInfo = {
  name: "rssAgent",
  agent: rssAgent,
  mock: rssAgent,
  description: "Retrieves data from wikipedia",
  category: ["data"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default rssAgentInfo;
