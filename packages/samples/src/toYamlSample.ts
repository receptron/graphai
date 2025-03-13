import { GraphData, NodeData, isComputedNodeData } from "graphai";
import { stringify, parse } from "yaml";
import { writeFileSync, readFileSync } from "fs";

import { graph_data as chat } from "./interaction/chat";
import { graph_data as metachat } from "./interaction/metachat";
import { graph_data as reception } from "./interaction/reception";
import { graph_data as weather } from "./net/weather";
import { graph_data as interview } from "./llm/interview";
import { graph_data as wikipedia } from "./embeddings/wikipedia";

import { graph_data as loop_people } from "./test/loop";

const updateAgent = (agentData: Record<string, any>, toLlmAgent: string) => {
  agentData.agent = toLlmAgent === "ollamaAgent" ? "openAIAgent" : toLlmAgent;
  const params = agentData.params ?? {};
  if (toLlmAgent === "groqAgent") {
    agentData.params = { ...params, model: "Llama3-8b-8192" };
  } else if (toLlmAgent === "openAIAgent") {
    agentData.params = { ...params, model: "gpt-4o" };
  } else if (toLlmAgent === "ollamaAgent") {
    agentData.params = { ...params, model: "llama3", baseURL: "http://127.0.0.1:11434/v1" };
  } else if (["anthropicAgent", "geminiAgent"].includes(toLlmAgent)) {
    delete params.model;
    agentData.params = params;
  }
  return agentData;
};

const update = (nodes: Record<string, NodeData>, toLlmAgent: string): Record<string, NodeData> => {
  return Object.keys(nodes).reduce((tmp: Record<string, any>, key: string) => {
    const node = nodes[key];
    if (isComputedNodeData(node) && typeof node.agent === "string") {
      if (["groqAgent", "openAIAgent", "anthropicAgent", "geminiAgent"].includes(node.agent)) {
        tmp[key] = updateAgent(node, toLlmAgent);
        return tmp;
      } else if (node.graph && typeof node.graph !== 'string' && node.graph.nodes) {
        node.graph.nodes = update(node.graph.nodes, toLlmAgent);
        tmp[key] = node;
        return tmp;
      }
    }
    tmp[key] = node;
    return tmp;
  }, {});
};

const write = (graph_data: GraphData, toLlmAgent: string, dirname: string, filename: string) => {
  graph_data.nodes = update(graph_data.nodes, toLlmAgent);

  const path = __dirname + "/../graph_data/" + dirname + "/" + filename;
  // console.log(JSON.stringify(graph_data, null, 2));
  const yamlStr = stringify(graph_data);
  writeFileSync(path, yamlStr, "utf8");
};

const readYaml = (filename: string) => {
  const path = __dirname + "/simple/" + filename;
  const yamlStr = readFileSync(path, "utf8");
  const graph = parse(yamlStr);
  return graph;
};

const loop = readYaml("loop.yaml");
const map = readYaml("map.yaml");
const simple = readYaml("simple.yaml");
const simple2 = readYaml("simple2.yaml");
const dispatcher = readYaml("dispatcher.yaml");
const business_idea_jp = readYaml("business_idea_jp.yaml");

[
  ["openAIAgent", "openai"],
  ["geminiAgent", "google"],
  ["groqAgent", "groq"],
  ["ollamaAgent", "ollama"],
].forEach(([agent, dir]) => {
  write(chat, agent, dir, "chat.yaml");
  if (dir === "openai") {
    write(metachat, agent, dir, "metachat.yaml");
    write(dispatcher, agent, dir, "dispatcher.yaml");
  }

  write(reception, agent, dir, "reception.yaml");
  write(weather, agent, dir, "weather.yaml");
  write(interview, agent, dir, "interview.yaml");
  write(wikipedia, agent, dir, "wikipedia_rag.yaml");
  //
  write(loop, agent, dir, "loop.yaml");
  write(map, agent, dir, "map.yaml");
  write(simple, agent, dir, "simple.yaml");
  write(simple2, agent, dir, "simple2.yaml");
  write(business_idea_jp, agent, dir, "business_idea_jp.yaml");
});

[["anthropicAgent", "anthropic"]].forEach(([agent, dir]) => {
  write(chat, agent, dir, "chat.yaml");

  //
  write(loop, agent, dir, "loop.yaml");
  write(map, agent, dir, "map.yaml");
  write(simple, agent, dir, "simple.yaml");
  write(simple2, agent, dir, "simple2.yaml");
});

write(loop_people, "openAIAgent", "test", "loop.yaml");
