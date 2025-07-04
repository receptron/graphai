import { AgentFunctionInfo, AgentFunctionInfoDictionary } from "graphai";
import { debugResultKey } from "graphai/lib/utils/utils";

// json-schema-generator was unmaintained, replace with a simple schema generator
const generateSchema = (value: any): any => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: "array" };
    }
    return { type: "array", items: generateSchema(value[0]) };
  }
  if (value === null) {
    return { type: "null" };
  }
  if (typeof value === "object") {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    for (const key of Object.keys(value)) {
      properties[key] = generateSchema((value as any)[key]);
      required.push(key);
    }
    return { type: "object", properties, required };
  }
  if (typeof value === "string") {
    return { type: "string" };
  }
  if (typeof value === "number") {
    return { type: "number" };
  }
  if (typeof value === "boolean") {
    return { type: "boolean" };
  }
  return { type: "any" };
};

import fs from "fs";
import path from "path";

const agentAttribute = (agentInfo: AgentFunctionInfo, key: string) => {
  if (key === "samples") {
    return Array.from(agentInfo.samples.keys())
      .map((key) => {
        const sample = agentInfo.samples[key];
        return [
          `### Sample${key}`,
          "#### inputs",
          "```json",
          JSON.stringify(sample.inputs, null, 2),
          "```",
          "#### params",
          "```json",
          JSON.stringify(sample.params),
          "```",
          "#### result",
          "```json",
          JSON.stringify(sample.result, null, 2),
          "```",
        ].join("\n\n");
        // return JSON.stringify(agentInfo.samples, null, 2);
      })
      .join("\n");
  }
  if (key === "schemas") {
    if (agentInfo.inputs && agentInfo.output) {
      return [
        "#### inputs",
        "```json",
        JSON.stringify(agentInfo.inputs, null, 2),
        "```",
        "#### output",
        "```json",
        JSON.stringify(agentInfo.output, null, 2),
        "```",
      ].join("\n\n");
    }
    if (agentInfo.samples && agentInfo.samples[0]) {
      const sample = agentInfo.samples[0];
      return [
        "#### inputs",
        "```json",
        JSON.stringify(generateSchema(sample.inputs), null, 2),
        "```",
      ].join("\n\n");
    }
    return "";
  }
  if (key === "resultKey") {
    return agentInfo.samples
      .map((sample) => {
        return ["```json", JSON.stringify(debugResultKey("agentId", sample.result), null, 2), "```"].join("\n\n");
      })
      .join("\n");
  }
  if (key === "package") {
    if (agentInfo.package) {
      return ["## Package", `[${agentInfo.package}](https://www.npmjs.com/package/${agentInfo.package})`].join("\n");
    }
    return "";
  }
  if (key === "source") {
    if (agentInfo.source) {
      return ["## Source", `[${agentInfo.source}](${agentInfo.source})`].join("\n");
    }
    return "";
  }
  return agentInfo[key as keyof AgentFunctionInfo] as string;
};

export const readTemplate = (file: string) => {
  return fs.readFileSync(path.resolve(__dirname) + "/../mono_templates/" + file, "utf8");
};

const agentMd = (agentInfo: AgentFunctionInfo) => {
  const template = readTemplate("agent.md");
  const md = ["name", "description", "author", "repository", "license", "samples", "schemas", "resultKey", "package", "source"].reduce((tmp, key) => {
    tmp = tmp.replace("{" + key + "}", agentAttribute(agentInfo, key));
    return tmp;
  }, template);
  return md;
};
const IndexMd = (ret: Record<string, Record<string, string>>) => {
  const templates = [];
  for (const cat of Object.keys(ret)) {
    templates.push("## " + cat);
    for (const agentName of Object.keys(ret[cat])) {
      templates.push("### [" + agentName + "](./" + cat + "/" + agentName + ".md)");
    }
    templates.push("");
  }
  return templates.join("\n");
};

export const generateMonoDoc = (base_path: string, agents: AgentFunctionInfoDictionary) => {
  const ret: Record<string, Record<string, string>> = {};
  Object.values(agents).map((agent) => {
    const md = agentMd(agent);
    agent.category.map(async (cat: string) => {
      if (!ret[cat]) {
        ret[cat] = {};
      }
      ret[cat][agent.name] = agent.name;
      const catDir = path.resolve(base_path + cat);
      await fs.promises.mkdir(catDir, { recursive: true });
      fs.writeFileSync(catDir + "/" + agent.name + ".md", md);
    });
  });
  // console.log(ret);
  const index = IndexMd(ret);
  fs.writeFileSync(base_path + "/README.md", index);
};
