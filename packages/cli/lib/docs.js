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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTemplate = void 0;
const utils_1 = require("graphai/lib/utils/utils");
const json_schema_generator_1 = __importDefault(require("json-schema-generator"));
const packages = __importStar(require("@graphai/agents"));
const vanilla_node_agents_1 = require("@graphai/vanilla_node_agents");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const agentAttribute = (agentInfo, key) => {
    if (key === "samples") {
        return Array.from(agentInfo.samples.keys())
            .map((key) => {
            const sample = agentInfo.samples[key];
            return [
                `### Sample${key}`,
                "#### inputs",
                "```json",
                JSON.stringify(sample.inputs, null, 2),
                "````",
                "#### params",
                "```json",
                JSON.stringify(sample.params),
                "````",
                "#### result",
                "```json",
                JSON.stringify(sample.result, null, 2),
                "````",
            ].join("\n\n");
            // return JSON.stringify(agentInfo.samples, null, 2);
        })
            .join("\n");
    }
    if (key === "schemas") {
        if (agentInfo.inputs && agentInfo.output) {
            return [
                "#### inputs",
                "```json",
                JSON.stringify(agentInfo.inputs, null, 2),
                "````",
                "#### output",
                "```json",
                JSON.stringify(agentInfo.output, null, 2),
                "````",
            ].join("\n\n");
        }
        if (agentInfo.samples && agentInfo.samples[0]) {
            const sample = agentInfo.samples[0];
            return ["#### inputs", "```json", JSON.stringify((0, json_schema_generator_1.default)(sample.inputs), null, 2), "````"].join("\n\n");
        }
        return "";
    }
    if (key === "resultKey") {
        return agentInfo.samples
            .map((sample) => {
            return ["```json", JSON.stringify((0, utils_1.debugResultKey)("agentId", sample.result), null, 2), "````"].join("\n\n");
        })
            .join("\n");
    }
    return agentInfo[key];
};
const readTemplate = (file) => {
    return fs_1.default.readFileSync(path_1.default.resolve(__dirname) + "/../templates/" + file, "utf8");
};
exports.readTemplate = readTemplate;
const agentMd = (agentInfo) => {
    const template = (0, exports.readTemplate)("agent.md");
    const md = ["name", "description", "author", "repository", "license", "samples", "schemas", "resultKey"].reduce((tmp, key) => {
        tmp = tmp.replace("{" + key + "}", agentAttribute(agentInfo, key));
        return tmp;
    }, template);
    return md;
};
const IndexMd = (ret) => {
    const templates = [];
    for (const cat of Object.keys(ret)) {
        templates.push("## " + cat);
        for (const agentName of Object.keys(ret[cat])) {
            templates.push("### [" + agentName + "](./" + cat + "/" + agentName + ".md)");
        }
        templates.push("");
    }
    return templates.join("\n");
};
const main = () => {
    const ret = {};
    const base_path = __dirname + "/../../../docs/agentDocs/";
    Object.values({ ...packages, fileReadAgent: vanilla_node_agents_1.fileReadAgent }).map((agent) => {
        const md = agentMd(agent);
        agent.category.map(async (cat) => {
            if (!ret[cat]) {
                ret[cat] = {};
            }
            ret[cat][agent.name] = agent.name;
            const catDir = path_1.default.resolve(base_path + cat);
            await fs_1.default.promises.mkdir(catDir, { recursive: true });
            fs_1.default.writeFileSync(catDir + "/" + agent.name + ".md", md);
        });
    });
    // console.log(ret);
    const index = IndexMd(ret);
    fs_1.default.writeFileSync(base_path + "/README.md", index);
};
main();
