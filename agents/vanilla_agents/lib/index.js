"use strict";
// This file adds agents that runs in pure JavaScript without any external npm modules.
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEmbeddingsAgent = void 0;
// Please refrain from adding agents that require npm. Those should be added to the index.ts.
__exportStar(require("./string_agents"), exports);
__exportStar(require("./array_agents"), exports);
__exportStar(require("./matrix_agents"), exports);
__exportStar(require("./test_agents"), exports);
__exportStar(require("./graph_agents"), exports);
__exportStar(require("./data_agents"), exports);
__exportStar(require("./service_agents"), exports);
__exportStar(require("./sleeper_agents"), exports);
__exportStar(require("./compare_agents"), exports);
const embedding_agent_1 = __importDefault(require("./embedding_agent"));
exports.stringEmbeddingsAgent = embedding_agent_1.default;
