"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFlatAgent = exports.shiftAgent = exports.popAgent = exports.pushAgent = void 0;
const push_agent_1 = __importDefault(require("./push_agent"));
exports.pushAgent = push_agent_1.default;
const pop_agent_1 = __importDefault(require("./pop_agent"));
exports.popAgent = pop_agent_1.default;
const shift_agent_1 = __importDefault(require("./shift_agent"));
exports.shiftAgent = shift_agent_1.default;
const array_flat_agent_1 = __importDefault(require("./array_flat_agent"));
exports.arrayFlatAgent = array_flat_agent_1.default;
