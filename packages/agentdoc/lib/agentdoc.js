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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const readTemplate = (file) => {
    return fs_1.default.readFileSync(path_1.default.resolve(__dirname) + "/../templates/" + file, "utf8");
};
const main = async () => {
    const npmRootPath = process.cwd();
    const packagePath = npmRootPath + "/package.json";
    if (!fs_1.default.existsSync(packagePath)) {
        console.log("No package.json. Run this script in root of npm repository directory.");
        return;
    }
    const packageJson = JSON.parse(fs_1.default.readFileSync(packagePath, "utf8"));
    const agents = await Promise.resolve(`${npmRootPath + "/lib/index"}`).then(s => __importStar(require(s)));
    const agentKeys = Object.keys(agents).sort((a, b) => (a > b ? 1 : -1));
    const agentAttribute = (key) => {
        if (key === "packageName") {
            return packageJson.name;
        }
        if (key === "description") {
            return packageJson.description;
        }
        if (key === "agents") {
            if (agentKeys.length > 0) {
                if (agentKeys.length > 5) {
                    return ["\n  ", agentKeys.join(",\n  "), "\n"].join("");
                }
                return agentKeys.join(", ");
            }
        }
        if (key === "relatedAgents") {
            const agents = Object.keys(packageJson.dependencies ?? {}).filter((depend) => (depend.match(/^@graphai/) && depend.match(/_agents?$/)) || depend === "@graphai/vanilla");
            if (agents.length > 0) {
                return ["### Related Agent Packages", agents.map((agent) => ` - [${agent}](https://www.npmjs.com/package/${agent})`).join("\n")].join("\n");
            }
            return "";
        }
        if (key === "environmentVariables") {
            const targets = agentKeys.filter((key) => agents[key].environmentVariables);
            if (targets.length > 0) {
                return ["### Environment Variables", targets.map((target) => [` - ${target}`, agents[target].environmentVariables.map((env) => `   - ${env}`)])]
                    .flat(4)
                    .join("\n");
            }
            return "";
        }
        if (key === "sample") {
            return [
                agentKeys.map((key) => {
                    const agent = agents[key];
                    return ` - [${agent.name}](https://github.com/receptron/graphai/blob/main/docs/agentDocs/${agent.category[0]}/${agent.name}.md)`;
                }),
            ]
                .flat(2)
                .join("\n");
            return "";
        }
        if (key === "agentsDescription") {
            return agentKeys
                .map((key) => {
                const agent = agents[key];
                return `- ${agent.name} - ${agent.description}`;
            })
                .join("\n");
        }
    };
    const temp = readTemplate(packageJson.name === "@graphai/agents" ? "readme-agent.md" : "readme.md");
    const md = ["packageName", "description", "agents", "relatedAgents", "environmentVariables", "sample", "agentsDescription"].reduce((tmp, key) => {
        tmp = tmp.replaceAll("{" + key + "}", agentAttribute(key));
        return tmp;
    }, temp);
    const readDocIfExist = (key) => {
        const docPath = npmRootPath + "/docs/" + key + ".md";
        if (fs_1.default.existsSync(docPath)) {
            return fs_1.default.readFileSync(docPath, "utf8");
        }
        return "";
    };
    const md2 = ["GraphDataJSON", "READMEBefore", "READMEAfter"].reduce((tmp, key) => {
        tmp = tmp.replaceAll("{" + key + "}", readDocIfExist(key));
        return tmp;
    }, md);
    fs_1.default.writeFileSync(npmRootPath + "/README.md", md2);
};
main();
