"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.popAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const popAgent = async (context) => {
    const { inputs } = context;
    const [array] = (0, deepmerge_1.default)({ inputs }, {}).inputs;
    // TODO: Validation
    const item = array.pop();
    return { array, item };
};
exports.popAgent = popAgent;
