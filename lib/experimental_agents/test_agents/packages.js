"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bypassAgent = exports.echoAgent = void 0;
const echo_agent_1 = __importDefault(require("../../experimental_agents/test_agents/echo_agent"));
exports.echoAgent = echo_agent_1.default;
const bypass_agent_1 = __importDefault(require("../../experimental_agents/test_agents/bypass_agent"));
exports.bypassAgent = bypass_agent_1.default;
