"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikipediaAgent = exports.fetchAgent = void 0;
const wikipedia_1 = __importDefault(require("./wikipedia"));
exports.wikipediaAgent = wikipedia_1.default;
const fetch_agent_1 = __importDefault(require("./fetch_agent"));
exports.fetchAgent = fetch_agent_1.default;
