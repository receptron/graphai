#!/usr/bin/env node
import fs from "fs";
import { readTemplate } from "./docs";

const main = async () => {
  const path = process.cwd();
  const packageJson = JSON.parse(fs.readFileSync(path + "/package.json", "utf8"));
   
  const agents = await import(path + "/lib/index");

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

  fs.writeFileSync(path + "/README.md", md);
};

main();
