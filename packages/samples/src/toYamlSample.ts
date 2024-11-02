import { stringify } from "yaml";
import { writeFileSync } from "fs";

import { graph_data as chat } from "./interaction/chat";
import { graph_data as metachat } from "./interaction/metachat";
import { graph_data as reception } from "./interaction/reception";
import { graph_data as weather } from "./net/weather";
import { graph_data as interview } from "./llm/interview";
import { graph_data as wikipedia } from "./embeddings/wikipedia";

const isObject = (x: unknown): x is Record<string, any> => {
  return x !== null && typeof x === "object";
};
const updateAgent = (agentData: Record<string, any>, llmAgent: string) => {
  agentData.agent = llmAgent;
  agentData.params = llmAgent === "groqAgent" ? {
    model: "Llama3-8b-8192"
  } : {};
  return agentData;
};

const update = (graph_data: any, llmAgent: string): any => {
  if (Array.isArray(graph_data)) {
    return graph_data.map(g => update(g, llmAgent));
  }
  if (isObject(graph_data)) {
    return Object.keys(graph_data).reduce((tmp: Record<string, any>, key: string) => {
      if (graph_data[key].agent && ["groqAgent", "openAIAgent", "anthropicAgent"].includes(graph_data[key].agent)) {
        tmp[key] = updateAgent(graph_data[key], llmAgent);
      } else {
        tmp[key] = update(graph_data[key], llmAgent);
      }
      return tmp;
    }, {});
  }
  return graph_data;
};
const write = (graph_data: any, llmAgent: string, dirname: string, filename: string) => {
  graph_data.nodes = update(graph_data.nodes, llmAgent);
  // console.log(graph_data, __dirname);

  const path = __dirname + "/../graph_data/" + dirname + "/" + filename;
  console.log(JSON.stringify(graph_data, null, 2));
  const yamlStr = stringify(graph_data);
  writeFileSync(path, yamlStr, "utf8");
};

[
  ["openAIAgent", "openai"],
  ["anthropicAgent", "anthropic"],
  ["geminiAgent", "google"],
  ["groqAgent", "groq"],
].forEach(([agent, dir]) => {
  write(chat, agent, dir, "chat.yaml");
  write(metachat, agent, dir, "metachat.yaml");
  write(reception, agent, dir, "reception.yaml");
  write(weather, agent, dir, "weather.yaml");
  write(interview, agent, dir, "interview.yaml");
  write(wikipedia, agent, dir, "wikipedia_rag.yaml");
});
