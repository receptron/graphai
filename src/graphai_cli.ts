import { GraphAI, AgentFunction } from "./graphai";
import fs from "fs";
import path from "path";
import YAML from "yaml";

export const testAgent: AgentFunction<{ delay: number; fail: boolean }> = async (context) => {
  return {};
}

const main = async () => {
  const file = process.argv[2];
  if (file === undefined) {
    console.log("no file");
    return 
  }
  const file_path = path.resolve(process.cwd() + "/"+ file);
  if (!fs.existsSync(file_path)) {
    console.log("no file");
    return 
  }
  try {
    const graph_data_file = fs.readFileSync(file_path, "utf8");
    const graph_data = YAML.parse(graph_data_file);

    const graph = new GraphAI(graph_data, {test: testAgent});
    const results = await graph.run();
    console.log(results);
  } catch (e) {
    console.log("error", e);
  }
};

main();
