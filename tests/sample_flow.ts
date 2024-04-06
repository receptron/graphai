import path from "path";
import { GraphAI } from "../src/graphai";
import { readManifestData } from "../src/file_utils";

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);
  const graph = new GraphAI(graph_data, async (node, transactionId, retry, params, payload) => {
    console.log("executing", node, params, payload);
    setTimeout(() => {
      if (params.fail && retry < 2) {
        const result = { [node]: "failed" };
        console.log("failed", node, result, retry);
        graph.reportError(node, transactionId, result);
      } else {
        const result = { [node]: "output" };
        console.log("completing", node, result);
        graph.feed(node, transactionId, result);
      }
    }, params.delay);
  });

  await graph.run();
};

const main = async () => {
  await test("/graphs/sample1.yml");
  console.log("COMPLETE 1");
  await test("/graphs/sample2.yml");
  console.log("COMPLETE 2");
};
main();
