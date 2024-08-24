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

  const agentAttribute = (key: string) => {
    if (key === "packageName") {
      return packageJson.name;
    }
    if (key === "description") {
      return packageJson.description;
    }
    if (key === "agents") {
      return Object.keys(agents).join(", ");
    }
  };
  const temp = readTemplate("readme.md");
  const md = ["packageName", "description", "agents"].reduce((tmp, key) => {
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

  const md2 = ["READMEBefore", "READMEAfter"].reduce((tmp, key) => {
    tmp = tmp.replaceAll("{" + key + "}", readDocIfExist(key));
    return tmp;
  }, md);

  fs.writeFileSync(npmRootPath + "/README.md", md2);
};

main();
