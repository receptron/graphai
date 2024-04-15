#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphai_1 = require("./graphai");
const experimental_agents_1 = require("./experimental_agents");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const testAgent = async () => {
    return {};
};
const main = async () => {
    const file = process.argv[2];
    if (file === undefined) {
        console.log("no file");
        return;
    }
    const file_path = path_1.default.resolve(process.cwd() + "/" + file);
    if (!fs_1.default.existsSync(file_path)) {
        console.log("no file");
        return;
    }
    try {
        const graph_data_file = fs_1.default.readFileSync(file_path, "utf8");
        const graph_data = yaml_1.default.parse(graph_data_file);
        const graph = new graphai_1.GraphAI(graph_data, { testAgent, slashGPTAgent: experimental_agents_1.slashGPTAgent, stringTemplateAgent: experimental_agents_1.stringTemplateAgent });
        const results = await graph.run();
        console.log(results);
    }
    catch (e) {
        console.log("error", e);
    }
};
main();
