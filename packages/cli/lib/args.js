"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.args = exports.hasOption = void 0;
const yargs_1 = __importDefault(require("yargs"));
exports.hasOption = ["-l", "--list", "-d", "--detail", "-s", "--sample"].some((o) => process.argv.includes(o));
exports.args = yargs_1.default
    .scriptName("graphai")
    .option("list", {
    alias: "l",
    description: "agents list",
})
    .option("sample", {
    alias: "s",
    description: "agent sample data",
    type: "string",
})
    .option("d", {
    alias: "detail",
    describe: "agent detail",
    type: "string",
})
    .option("v", {
    alias: "verbose",
    describe: "verbose log",
    demandOption: true,
    default: false,
    type: "boolean",
})
    .option("m", {
    alias: "mermaid",
    describe: "mermaid",
    demandOption: true,
    default: false,
    type: "boolean",
})
    .option("yaml", {
    describe: "dump yaml",
    demandOption: true,
    default: false,
    type: "boolean",
})
    .option("json", {
    describe: "dump json",
    demandOption: true,
    default: false,
    type: "boolean",
})
    .option("log", {
    description: "output log",
    demandOption: false,
    type: "string",
})
    .command(exports.hasOption ? "* [yaml_or_json_file]" : "* <yaml_or_json_file>", "run GraphAI with GraphAI file.")
    .positional("yaml_or_json_file", {
    describe: "yaml or json file",
    type: "string",
    demandOption: exports.hasOption,
})
    .parseSync();
