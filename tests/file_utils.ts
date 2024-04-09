import fs from "fs";
import path from 'path';
import YAML from "yaml";

export const mkdirLogDir = () => {
  const logsDir = path.join(__dirname, './logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
};

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
