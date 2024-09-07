"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeGraphExample = void 0;
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const writeGraphExample = (dataSet, dir) => {
    const json = ["### GraphData Example\n"];
    const yamls = [];
    Object.keys(dataSet).map((key) => {
        const grapData = dataSet[key];
        json.push(`#### ${key}`);
        json.push("```json\n" + JSON.stringify(grapData, null, 2) + "\n```\n");
        yamls.push(`#### ${key}`);
        yamls.push("```yaml\n" + yaml_1.default.stringify(grapData) + "\n```\n");
    });
    fs_1.default.writeFileSync(dir + "GraphDataJSON.md", json.join("\n"));
    fs_1.default.writeFileSync(dir + "GraphDataYAML.md", yamls.join("\n"));
};
exports.writeGraphExample = writeGraphExample;
