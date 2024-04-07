import path from "path";
import { GraphAI } from "../src/graphai";
import { ChatSession, ChatConfig } from "slashgpt";
import { readManifestData } from "../src/file_utils";

const config = new ChatConfig(path.resolve(__dirname));

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);
  const graph = new GraphAI(graph_data, async (nodeId, retry, params, payload) => {
    console.log("executing", nodeId, params, payload);
    const session = new ChatSession(config, params.manifest ?? {});
    const prompt = Object.keys(payload).reduce((prompt, key) => {
      return prompt.replace("${" + key + "}", payload[key]["answer"]);
    }, params.prompt);
    session.append_user_question(prompt);

    await session.call_loop(() => {});
    const message = session.history.last_message();
    if (message === undefined) {
      throw new Error('No message in the history');
    }
    const result = { answer: message.content };
    console.log(result);
    return result;
  });
  await graph.run();
};

const main = async () => {
  await test("/graphs/sample3.yml");
  console.log("COMPLETE 1");
};
main();
