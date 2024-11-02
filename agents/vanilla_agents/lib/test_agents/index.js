"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamMockAgent = exports.mergeNodeIdAgent = exports.copy2ArrayAgent = exports.copyMessageAgent = exports.countingAgent = exports.echoAgent = void 0;
const echo_agent_1 = __importDefault(require("./echo_agent"));
exports.echoAgent = echo_agent_1.default;
// import bypassAgent from "./bypass_agent";
const counting_agent_1 = __importDefault(require("./counting_agent"));
exports.countingAgent = counting_agent_1.default;
const copy_message_agent_1 = __importDefault(require("./copy_message_agent"));
exports.copyMessageAgent = copy_message_agent_1.default;
const copy2array_agent_1 = __importDefault(require("./copy2array_agent"));
exports.copy2ArrayAgent = copy2array_agent_1.default;
const merge_node_id_agent_1 = __importDefault(require("./merge_node_id_agent"));
exports.mergeNodeIdAgent = merge_node_id_agent_1.default;
const stream_mock_agent_1 = __importDefault(require("./stream_mock_agent"));
exports.streamMockAgent = stream_mock_agent_1.default;
