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
exports.main = exports.getPackageJson = exports.getGitRep = exports.getAgents = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const readTemplate = (file) => {
    return fs_1.default.readFileSync(path_1.default.resolve(__dirname) + "/../templates/" + file, "utf8");
};
const agentsDescription = (agentKeys, agents) => {
    return agentKeys
        .map((key) => {
        const agent = agents[key];
        return `- ${agent.name} - ${agent.description}`;
    })
        .join("\n");
};
const getAgents = (agentKeys) => {
    if (agentKeys.length > 0) {
        if (agentKeys.length > 5) {
            return ["\n  ", agentKeys.join(",\n  "), "\n"].join("");
        }
        return agentKeys.join(", ");
    }
};
exports.getAgents = getAgents;
const getRelatedAgents = (packageJson) => {
    const agents = Object.keys(packageJson.dependencies ?? {}).filter((depend) => (depend.match(/^@graphai/) && depend.match(/_agents?$/)) || depend === "@graphai/vanilla");
    if (agents.length > 0) {
        return ["### Related Agent Packages", agents.map((agent) => ` - [${agent}](https://www.npmjs.com/package/${agent})`).join("\n")].join("\n");
    }
    return "";
};
const getExamples = (agentKeys, agents) => {
    const targets = agentKeys.filter((key) => agents[key].samples && agents[key].samples.length > 0);
    if (targets.length > 0) {
        return [
            "### Input/Params example",
            targets.map((target) => [
                ` - ${target}`,
                agents[target].samples.map((sample) => `\n\`\`\`typescript\n${JSON.stringify({ inputs: sample.inputs, params: sample.params }, null, 2)}\n\`\`\`\n`),
            ]),
        ]
            .flat(4)
            .join("\n");
    }
    return "";
};
const getSample = (agentKeys, agents, gitConfig) => {
    return [
        agentKeys.map((key) => {
            const agent = agents[key];
            return ` - [${agent.name}](https://github.com/${gitConfig}/blob/main/docs/agentDocs/${agent.category[0]}/${agent.name}.md)`;
        }),
    ]
        .flat(2)
        .join("\n");
};
const getGitRep = (repository) => {
    const defaultGitConfig = "receptron/graphai";
    const url = typeof repository === "string" ? repository : repository?.url;
    if (!url) {
        return defaultGitConfig;
    }
    const webUrl = url
        .replace(/^git\+/, "")
        .replace(/^git@github\.com:/, "https://github.com/")
        .replace(/^ssh:\/\/github\.com\//, "https://github.com/")
        .replace(/\.git$/, "");
    const gitNames = webUrl
        .replace(/^https:\/\/github.com\//, "")
        .split("/")
        .slice(0, 2);
    if (gitNames.length === 2) {
        return gitNames.join("/");
    }
    return defaultGitConfig;
};
exports.getGitRep = getGitRep;
const getEnvironmentVariables = (agentKeys, agents) => {
    const targets = agentKeys.filter((key) => agents[key].environmentVariables);
    if (targets.length > 0) {
        return ["### Environment Variables", targets.map((target) => [` - ${target}`, agents[target]?.environmentVariables?.map((env) => `   - ${env}`)])]
            .flat(4)
            .join("\n");
    }
    return "";
};
const getPackageJson = (npmRootPath) => {
    const packagePath = npmRootPath + "/package.json";
    if (!fs_1.default.existsSync(packagePath)) {
        return null;
    }
    const packageJson = JSON.parse(fs_1.default.readFileSync(packagePath, "utf8"));
    return packageJson;
};
exports.getPackageJson = getPackageJson;
const main = async (npmRootPath) => {
    const packageJson = (0, exports.getPackageJson)(npmRootPath);
    if (!packageJson) {
        console.log("No package.json. Run this script in root of npm repository directory.");
        return;
    }
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
            return (0, exports.getAgents)(agentKeys);
        }
        if (key === "relatedAgents") {
            return getRelatedAgents(packageJson);
        }
        if (key === "environmentVariables") {
            return getEnvironmentVariables(agentKeys, agents);
        }
        if (key === "sample") {
            const gitConfig = (0, exports.getGitRep)(packageJson.repository ?? "");
            return getSample(agentKeys, agents, gitConfig);
        }
        if (key === "agentsDescription") {
            return agentsDescription(agentKeys, agents);
        }
        if (key === "examples") {
            return getExamples(agentKeys, agents);
        }
    };
    const temp = readTemplate(packageJson.name === "@graphai/agents" ? "readme-agent.md" : "readme.md");
    const md = ["packageName", "description", "agents", "relatedAgents", "environmentVariables", "sample", "agentsDescription", "examples"].reduce((tmp, key) => {
        tmp = tmp.replaceAll("{" + key + "}", agentAttribute(key) ?? "");
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
exports.main = main;
