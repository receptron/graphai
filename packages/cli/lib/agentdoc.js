#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const docs_1 = require("./docs");
const main = async () => {
    const path = process.cwd();
    const packageJson = JSON.parse(fs_1.default.readFileSync(path + "/package.json", "utf8"));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const agents = require(path + "/lib/index");
    const agentAttribute = (key) => {
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
    const temp = (0, docs_1.readTemplate)("readme.md");
    const md = ["packageName", "description", "agents"].reduce((tmp, key) => {
        tmp = tmp.replaceAll("{" + key + "}", agentAttribute(key));
        return tmp;
    }, temp);
    fs_1.default.writeFileSync(path + "/README.md", md);
};
main();
