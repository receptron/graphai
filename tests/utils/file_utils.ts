import fs from "fs";
import path from "path";
import YAML from "yaml";

export const mkdirLogDir = () => {
  const logsDir = path.join(__dirname, "../logs");

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
};

export const readGraphaiData = (file: string) => {
  if (file.endsWith(".yaml") || file.endsWith(".yml")) {
    return readYamlFile(file);
  }
  if (file.endsWith(".json")) {
    return readJsonFile(file);
  }
  throw new Error("No file exists " + file);
};

const readJsonFile = (fileName: string) => {
  const file_file = fs.readFileSync(fileName, "utf8");
  const file = JSON.parse(file_file);
  return file;
};

const readYamlFile = (fileName: string) => {
  const file_file = fs.readFileSync(fileName, "utf8");
  const file = YAML.parse(file_file);
  return file;
};

export const fileBaseName = (file: string) => {
  return path.basename(file).replace(/\.[a-zA-Z_-]+$/, "");
};
