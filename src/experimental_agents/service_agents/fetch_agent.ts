import { AgentFunction } from "@/graphai";

export const fetchAgent: AgentFunction<undefined, any, string> = async ({ inputs }) => {
  const [ url ] = inputs;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

const fetchAgentInfo = {
  name: "fetchAgent",
  agent: fetchAgent,
  mock: fetchAgent,
  description: "Retrieves JSON data from the specified URL",
  category: ["data"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default fetchAgentInfo;