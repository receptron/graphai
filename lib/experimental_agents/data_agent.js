"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSumTemplateAgent = exports.dataObjectMergeTemplateAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const dataObjectMergeTemplateAgent = async ({ nodeId, params, inputs, verbose }) => {
    if (verbose) {
        console.log("executing", nodeId, params);
    }
    return inputs.reduce((tmp, input) => {
        return (0, deepmerge_1.default)(tmp, input);
    }, {});
};
exports.dataObjectMergeTemplateAgent = dataObjectMergeTemplateAgent;
const dataSumTemplateAgent = async ({ nodeId, params, inputs, verbose }) => {
    if (verbose) {
        console.log("executing", nodeId, params);
    }
    return inputs.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
};
exports.dataSumTemplateAgent = dataSumTemplateAgent;
