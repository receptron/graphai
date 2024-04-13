"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashGPTAgent = void 0;
const path_1 = __importDefault(require("path"));
const slashgpt_1 = require("slashgpt");
const config = new slashgpt_1.ChatConfig(path_1.default.resolve(__dirname));
const slashGPTAgent = async (context) => {
    console.log("executing", context.nodeId, context.params);
    const session = new slashgpt_1.ChatSession(config, context.params.manifest ?? {});
    const query = context.params?.query ? [context.params.query] : [];
    const contents = query.concat(context.inputs.map((input) => {
        return input.content;
    }));
    session.append_user_question(contents.join("\n"));
    await session.call_loop(() => { });
    const message = session.history.last_message();
    if (message === undefined) {
        throw new Error("No message in the history");
    }
    return message;
};
exports.slashGPTAgent = slashGPTAgent;
