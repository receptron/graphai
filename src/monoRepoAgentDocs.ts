import * as packages from "@graphai/agents";
import { fileReadAgent } from "@graphai/vanilla_node_agents";
import { generateMonoDoc } from "@receptron/agentdoc"

const main = () => {
  const base_path = __dirname + "/../docs/agentDocs/";
  generateMonoDoc(base_path, { ...packages, fileReadAgent });
};

main();
