#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const graphai_1 = require("graphai");
const packages = __importStar(require("@graphai/agents"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const args_1 = require("./args");
const test_utils_1 = require("@graphai/test_utils");
const options_1 = require("./options");
const mermaid_1 = require("./mermaid");
const fileFullPath = (file) => {
    return path_1.default.resolve(process.cwd() + "/" + file) || "";
};
const main = async () => {
    if (args_1.hasOption) {
        (0, options_1.option)(args_1.args, packages);
        return;
    }
    const file_path = fileFullPath(args_1.args.yaml_or_json_file);
    if (!fs_1.default.existsSync(file_path)) {
        console.log("no file exist: " + file_path);
        return;
    }
    if (args_1.args.log) {
        const logfile = fileFullPath(args_1.args.log);
        (0, test_utils_1.mkdirLogDir)(path_1.default.dirname(logfile));
    }
    try {
        const graph_data = (0, test_utils_1.readGraphaiData)(file_path);
        if (args_1.args.mermaid) {
            (0, mermaid_1.mermaid)(graph_data);
            return;
        }
        if (args_1.args.json) {
            console.log(JSON.stringify(graph_data, null, 2));
            return;
        }
        if (args_1.args.yaml) {
            console.log(yaml_1.default.stringify(graph_data, null, 2));
            return;
        }
        const graph = new graphai_1.GraphAI(graph_data, packages);
        if (args_1.args.verbose) {
            graph.onLogCallback = test_utils_1.callbackLog;
        }
        try {
            const results = await graph.run();
            console.log(JSON.stringify(results, null, 2));
        }
        catch (e) {
            console.log("error", e);
        }
        if (args_1.args.log) {
            const logfile = fileFullPath(args_1.args.log);
            fs_1.default.writeFileSync(logfile, JSON.stringify(graph.transactionLogs(), null, 2));
        }
    }
    catch (e) {
        console.log("error", e);
    }
};
main();
