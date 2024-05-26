"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileBaseName = exports.readGraphaiData = exports.mkdirLogDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const mkdirLogDir = (logsDir) => {
    if (!fs_1.default.existsSync(logsDir)) {
        fs_1.default.mkdirSync(logsDir, { recursive: true });
    }
};
exports.mkdirLogDir = mkdirLogDir;
const readGraphaiData = (file) => {
    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
        return readYamlFile(file);
    }
    if (file.endsWith(".json")) {
        return readJsonFile(file);
    }
    throw new Error("No file exists " + file);
};
exports.readGraphaiData = readGraphaiData;
const readJsonFile = (fileName) => {
    const file_file = fs_1.default.readFileSync(fileName, "utf8");
    const file = JSON.parse(file_file);
    return file;
};
const readYamlFile = (fileName) => {
    const file_file = fs_1.default.readFileSync(fileName, "utf8");
    const file = yaml_1.default.parse(file_file);
    return file;
};
const fileBaseName = (file) => {
    return path_1.default.basename(file).replace(/\.[a-zA-Z_-]+$/, "");
};
exports.fileBaseName = fileBaseName;
