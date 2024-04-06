import path from "path";
import { GraphAI } from "../src/graphai";
import { readManifestData } from "../src/file_utils";
import { sleep } from "./utils";

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);

  const graph = new GraphAI(graph_data, async (nodeId, transactionId, retry, params, payload) => {
    console.log("executing", nodeId, params, payload);
    await sleep(params.delay);

    if (params.fail && retry < 2) {
      const result = { [nodeId]: "failed" };
      console.log("failed", nodeId, result, retry);
      graph.reportError(nodeId, transactionId, result);
    } else {
      const result = { [nodeId]: "output" };
      console.log("completing", nodeId, result);
      graph.feed(nodeId, transactionId, result);
    }
  });

  const results = await graph.run();
  console.log(results);
};

const main = async () => {
  await test("/graphs/sample1.yml");
  console.log("COMPLETE 1");
  await test("/graphs/sample2.yml");
  console.log("COMPLETE 2");
};
main();
