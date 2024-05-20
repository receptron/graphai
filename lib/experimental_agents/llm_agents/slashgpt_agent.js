"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashGPTAgent = void 0;
const path_1 = __importDefault(require("path"));
const slashgpt_1 = require("slashgpt");
const config = new slashgpt_1.ChatConfig(path_1.default.resolve(__dirname));
const slashGPTAgent = async ({ params, inputs, debugInfo: { verbose, nodeId }, filterParams }) => {
    if (verbose) {
        console.log("executing", nodeId, params);
    }
    const session = new slashgpt_1.ChatSession(config, params.manifest ?? {});
    const query = params?.query ? [params.query] : [];
    const contents = query.concat(inputs);
    session.append_user_question(contents.join("\n"));
    await session.call_loop(() => { }, (token) => {
        if (filterParams && filterParams.streamTokenCallback && token) {
            filterParams.streamTokenCallback(token);
        }
    });
    return session.history.messages();
};
exports.slashGPTAgent = slashGPTAgent;
const slashGPTAgentInfo = {
    name: "slashGPTAgent",
    agent: exports.slashGPTAgent,
    mock: exports.slashGPTAgent,
    samples: [],
    description: "Slash GPT Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: true,
    npms: ["slashgpt"],
};
exports.default = slashGPTAgentInfo;
