import { GraphData } from "graphai";
import yaml from "YAML";
import fs from "fs";

export const writeGraphExample = (dataSet: Record<string, GraphData>, dir: string) => {
  const json: string[] = [];
  const yamls: string[] = [];
  Object.keys(dataSet).map(key => {
    const grapData = dataSet[key];
    json.push(`## ${key}`);
    json.push("```json\n" + JSON.stringify(grapData, null, 2) +  "\n```\n");
    yamls.push(`## ${key}`);
    yamls.push("```yaml\n" + yaml.stringify(grapData)+  "\n```\n");
    
  });
  fs.writeFileSync(dir + "GraphDataJSON.md", json.join("\n"));
  fs.writeFileSync(dir + "GraphDataYAML.md", yamls.join("\n"));
};
