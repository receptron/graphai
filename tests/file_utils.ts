import fs from "fs";
import YAML from "yaml";

export const readGraphaiData = (file: string) => {
  if (file.endsWith(".yaml") || file.endsWith(".yml")) {
    return readYamlManifest(file);
  }
  if (file.endsWith(".json")) {
    return readJsonManifest(file);
  }
  throw new Error("No file exists " + file);
};

export const readJsonManifest = (fileName: string) => {
  const manifest_file = fs.readFileSync(fileName, "utf8");
  const manifest = JSON.parse(manifest_file);
  return manifest;
};

export const readYamlManifest = (fileName: string) => {
  const manifest_file = fs.readFileSync(fileName, "utf8");
  const manifest = YAML.parse(manifest_file);
  return manifest;
};
