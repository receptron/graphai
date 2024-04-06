import path from "path";
import { GraphAI, FlowCommand } from "../src/flow";

import { readManifestData } from "../src/file_utils";

const test = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readManifestData(file_path);
  return new Promise((resolve, reject) => {
    const graph = new GraphAI(graph_data, async (params) => {
      if (params.cmd == FlowCommand.Execute) {
          const node = params.node;
          console.log("executing", node, params.params, params.payload)
          setTimeout(() => {
            if (params.params.fail && params.retry < 2) {
              const result = { [node]:"failed" };
              console.log("failed", node, result, params.retry)
              graph.reportError(node, result);
            } else {
              const result = { [node]:"output" };
              console.log("completing", node, result)
              graph.feed(node, result)
            }
          }, params.params.delay);
      } else if (params.cmd == FlowCommand.OnComplete) {
        resolve(graph);
      }
    });
    graph.run();
  });
}

const main = async () => {
  await test("/graphs/sample1.yml");
  console.log("COMPLETE 1");
  await test("/graphs/sample2.yml");
  console.log("COMPLETE 2");
};
main();