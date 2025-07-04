"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMonoDoc = exports.readTemplate = void 0;
const utils_1 = require("graphai/lib/utils/utils");
// json-schema-generator was unmaintained, replace with a simple schema generator
const generateSchema = (value) => {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return { type: "array" };
        }
        return { type: "array", items: generateSchema(value[0]) };
    }
    if (value === null) {
        return { type: "null" };
    }
    if (typeof value === "object") {
        const properties = {};
        const required = [];
        for (const key of Object.keys(value)) {
            properties[key] = generateSchema(value[key]);
            required.push(key);
        }
        return { type: "object", properties, required };
    }
    if (typeof value === "string") {
        return { type: "string" };
    }
    if (typeof value === "number") {
        return { type: "number" };
    }
    if (typeof value === "boolean") {
        return { type: "boolean" };
    }
    return { type: "any" };
};
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
                "```",
                "#### params",
                "```json",
                JSON.stringify(sample.params),
                "```",
                "#### result",
                "```json",
                JSON.stringify(sample.result, null, 2),
                "```",
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
                "```",
                "#### output",
                "```json",
                JSON.stringify(agentInfo.output, null, 2),
                "```",
            ].join("\n\n");
        }
        if (agentInfo.samples && agentInfo.samples[0]) {
            const sample = agentInfo.samples[0];
            return ["#### inputs", "```json", JSON.stringify(generateSchema(sample.inputs), null, 2), "```"].join("\n\n");
        }
        return "";
    }
    if (key === "resultKey") {
        return agentInfo.samples
            .map((sample) => {
            return ["```json", JSON.stringify((0, utils_1.debugResultKey)("agentId", sample.result), null, 2), "```"].join("\n\n");
        })
            .join("\n");
    }
    if (key === "package") {
        if (agentInfo.package) {
            return ["## Package", `[${agentInfo.package}](https://www.npmjs.com/package/${agentInfo.package})`].join("\n");
        }
        return "";
    }
    if (key === "source") {
        if (agentInfo.source) {
            return ["## Source", `[${agentInfo.source}](${agentInfo.source})`].join("\n");
        }
        return "";
    }
    return agentInfo[key];
};
const readTemplate = (file) => {
    return fs_1.default.readFileSync(path_1.default.resolve(__dirname) + "/../mono_templates/" + file, "utf8");
};
exports.readTemplate = readTemplate;
const agentMd = (agentInfo) => {
    const template = (0, exports.readTemplate)("agent.md");
    const md = ["name", "description", "author", "repository", "license", "samples", "schemas", "resultKey", "package", "source"].reduce((tmp, key) => {
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
const generateMonoDoc = (base_path, agents) => {
    const ret = {};
    Object.values(agents).map((agent) => {
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
exports.generateMonoDoc = generateMonoDoc;
