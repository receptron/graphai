"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashGPTAgent = exports.gloqAgent = void 0;
const groq_agent_1 = __importDefault(require("../../experimental_agents/llm_agents/groq_agent"));
exports.gloqAgent = groq_agent_1.default;
const slashgpt_agent_1 = __importDefault(require("../../experimental_agents/llm_agents/slashgpt_agent"));
exports.slashGPTAgent = slashgpt_agent_1.default;
