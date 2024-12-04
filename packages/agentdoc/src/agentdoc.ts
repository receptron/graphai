#!/usr/bin/env node
import path from "path";
import fs from "fs";

const readTemplate = (file: string) => {
  return fs.readFileSync(path.resolve(__dirname) + "/../templates/" + file, "utf8");
};

const main = async () => {
  const npmRootPath = process.cwd();
  const packagePath = npmRootPath + "/package.json";
  if (!fs.existsSync(packagePath)) {
    console.log("No package.json. Run this script in root of npm repository directory.");
    return;
  }
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  const agents = await import(npmRootPath + "/lib/index");
  const agentKeys = Object.keys(agents).sort((a, b) => (a > b ? 1 : -1));

  const agentAttribute = (key: string) => {
    if (key === "packageName") {
      return packageJson.name;
    }
    if (key === "description") {
      return packageJson.description;
    }
    if (key === "agents") {
      if (agentKeys.length > 0) {
        if (agentKeys.length > 5) {
          return ["\n  ", agentKeys.join(",\n  "), "\n"].join("");
        }
        return agentKeys.join(", ");
      }
    }
    if (key === "relatedAgents") {
      const agents = Object.keys(packageJson.dependencies ?? {}).filter(
        (depend) => (depend.match(/^@graphai/) && depend.match(/_agents?$/)) || depend === "@graphai/vanilla",
      );
      if (agents.length > 0) {
        return ["### Related Agent Packages", agents.map((agent) => ` - [${agent}](https://www.npmjs.com/package/${agent})`).join("\n")].join("\n");
      }
      return "";
    }
    if (key === "environmentVariables") {
      const targets = agentKeys.filter((key) => agents[key].environmentVariables);
      if (targets.length > 0) {
        return ["### Environment Variables", targets.map((target) => [` - ${target}`, agents[target].environmentVariables.map((env: string) => `   - ${env}`)])]
          .flat(4)
          .join("\n");
      }
      return "";
    }
    if (key === "sample") {
      return [
        agentKeys.map((key: string) => {
          const agent = agents[key];
          return ` - [${agent.name}](https://github.com/receptron/graphai/blob/main/docs/agentDocs/${agent.category[0]}/${agent.name}.md)`;
        }),
      ]
        .flat(2)
        .join("\n");
      return "";
    }

    if (key === "agentsDescription") {
      return agentKeys
        .map((key: string) => {
          const agent = agents[key];
          return `- ${agent.name} - ${agent.description}`;
        })
        .join("\n");
    }
    if (key === "examples") {
      const targets = agentKeys.filter((key) => agents[key].samples && agents[key].samples.length > 0);
      if (targets.length > 0) {
        return ["### Input/Params example", targets.map((target) =>
          [` - ${target}`, agents[target].samples.map((sample: any) => `\n\`\`\`typescript\n${JSON.stringify({inputs: sample.inputs, params: sample.params}, null, 2)}\n\`\`\`\n`)])
        ]
          .flat(4)
          .join("\n");
      }
      return "";

    }
  };
  const temp = readTemplate(packageJson.name === "@graphai/agents" ? "readme-agent.md" : "readme.md");
  const md = ["packageName", "description", "agents", "relatedAgents", "environmentVariables", "sample", "agentsDescription", "examples"].reduce((tmp, key) => {
    tmp = tmp.replaceAll("{" + key + "}", agentAttribute(key));
    return tmp;
  }, temp);

  const readDocIfExist = (key: string) => {
    const docPath = npmRootPath + "/docs/" + key + ".md";
    if (fs.existsSync(docPath)) {
      return fs.readFileSync(docPath, "utf8");
    }
    return "";
  };

  const md2 = ["GraphDataJSON", "READMEBefore", "READMEAfter"].reduce((tmp, key) => {
    tmp = tmp.replaceAll("{" + key + "}", readDocIfExist(key));
    return tmp;
  }, md);

  fs.writeFileSync(npmRootPath + "/README.md", md2);
};

main();
