import { AgentFunction } from "@/graphai";
import { parseStringPromise } from "xml2js";

export const rssAgent: AgentFunction<undefined, any, string> = async ({ inputs }) => {
  const url = inputs[0];
  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    const jsonData = await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true });
    return jsonData;
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
