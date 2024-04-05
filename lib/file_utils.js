"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readYamlManifest = exports.readJsonManifest = exports.readManifestData = void 0;
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const readManifestData = (file) => {
    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
        return (0, exports.readYamlManifest)(file);
    }
    if (file.endsWith(".json")) {
        return (0, exports.readJsonManifest)(file);
    }
    throw new Error("No file exists " + file);
};
exports.readManifestData = readManifestData;
const readJsonManifest = (fileName) => {
    const manifest_file = fs_1.default.readFileSync(fileName, "utf8");
    const manifest = JSON.parse(manifest_file);
    return manifest;
};
exports.readJsonManifest = readJsonManifest;
const readYamlManifest = (fileName) => {
    const manifest_file = fs_1.default.readFileSync(fileName, "utf8");
    const manifest = yaml_1.default.parse(manifest_file);
    return manifest;
};
exports.readYamlManifest = readYamlManifest;
