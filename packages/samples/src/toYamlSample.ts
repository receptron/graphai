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
const updateAgent = (agentData: Record<string, any>, toLlmAgent: string) => {
  agentData.agent = toLlmAgent;
  const params = agentData.params ?? {};
  if (toLlmAgent === "groqAgent") {
    agentData.params = { ...params, model: "Llama3-8b-8192" };
  } else if (toLlmAgent === "openAIAgent") {
    agentData.params = { ...params, model: "gpt-4o"};
  } else if (["anthropicAgent", "geminiAgent"].includes(toLlmAgent)) {
    delete params.model;
    agentData.params = params;
  }
  return agentData;
};

const update = (graph_data: any, toLlmAgent: string): any => {
  if (Array.isArray(graph_data)) {
    return graph_data.map(g => update(g, toLlmAgent));
  }
  if (isObject(graph_data)) {
    return Object.keys(graph_data).reduce((tmp: Record<string, any>, key: string) => {
      if (graph_data[key].agent && ["groqAgent", "openAIAgent", "anthropicAgent", "geminiAgent"].includes(graph_data[key].agent)) {
        tmp[key] = updateAgent(graph_data[key], toLlmAgent);
      } else {
        tmp[key] = update(graph_data[key], toLlmAgent);
      }
      return tmp;
    }, {});
  }
  return graph_data;
};

const write = (graph_data: any, toLlmAgent: string, dirname: string, filename: string) => {
  graph_data.nodes = update(graph_data.nodes, toLlmAgent);

  const path = __dirname + "/../graph_data/" + dirname + "/" + filename;
  console.log(JSON.stringify(graph_data, null, 2));
  const yamlStr = stringify(graph_data);
  writeFileSync(path, yamlStr, "utf8");
};

[
  ["openAIAgent", "openai"],
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


[
  ["anthropicAgent", "anthropic"],
].forEach(([agent, dir]) => {
  write(chat, agent, dir, "chat.yaml");
});
