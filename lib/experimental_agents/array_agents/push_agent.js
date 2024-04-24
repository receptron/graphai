"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const pushAgent = async ({ inputs }) => {
    const [array, item] = (0, deepmerge_1.default)({ inputs }, {}).inputs;
    // TODO: Validation
    array.push(item);
    return array;
};
exports.pushAgent = pushAgent;
