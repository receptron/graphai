import path from "path";
import { GraphAI, NodeExecute } from "../src/graphai";
import { ChatSession, ChatConfig } from "slashgpt";
import { readManifestData } from "./file_utils";

const config = new ChatConfig(path.resolve(__dirname));

const testFunction: NodeExecute<Record<string, string>> = async (context) => {
  console.log("executing", context.nodeId, context.params, context.payload);
  const session = new ChatSession(config, context.params.manifest ?? {});
  const prompt = Object.keys(context.payload).reduce((prompt, key) => {
    return prompt.replace("${" + key + "}", context.payload[key]!["answer"]);
  }, context.params.prompt);
  session.append_user_question(prompt);

  await session.call_loop(() => {});
  const message = session.history.last_message();
  if (message === undefined) {
    throw new Error("No message in the history");
  }
  const result = { answer: message.content };
  console.log(result);
  return result;
};

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);
  const graph = new GraphAI(graph_data, testFunction);
  await graph.run();
};

const main = async () => {
  await test("/graphs/sample3.yml");
  console.log("COMPLETE 1");
};
main();
