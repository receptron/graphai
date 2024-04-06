import path from "path";
import { GraphAI } from "../src/graphai";
import { ChatSession, ChatConfig } from "slashgpt";
import { readManifestData } from "../src/file_utils";

const config = new ChatConfig(path.resolve(__dirname));

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);
  const graph = new GraphAI(graph_data, async (nodeId, transactionId, retry, params, payload) => {
    console.log("executing", nodeId, params, payload);
    const session = new ChatSession(config, params.manifest ?? {});
    const prompt = Object.keys(payload).reduce((prompt, key) => {
      return prompt.replace("${" + key + "}", payload[key]["answer"]);
    }, params.prompt);
    session.append_user_question(prompt);

    await session.call_loop((callback_type: string, data: unknown) => {
      if (callback_type === "bot") {
        const result = { answer: JSON.stringify(data) };
        console.log("completing", nodeId, result.answer);
        graph.feed(nodeId, transactionId, result);
      }
    });
  });
  await graph.run();
};

const main = async () => {
  await test("/graphs/sample3.yml");
  console.log("COMPLETE 1");
};
main();
