"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAgent = exports.dataSumTemplateAgent = exports.dataObjectMergeTemplateAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const dataObjectMergeTemplateAgent = async ({ inputs }) => {
    return inputs.reduce((tmp, input) => {
        return (0, deepmerge_1.default)(tmp, input);
    }, {});
};
exports.dataObjectMergeTemplateAgent = dataObjectMergeTemplateAgent;
const dataSumTemplateAgent = async ({ inputs }) => {
    return inputs.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
};
exports.dataSumTemplateAgent = dataSumTemplateAgent;
const totalAgent = async ({ inputs }) => {
    return inputs.reduce((result, input) => {
        Object.keys(input).forEach((key) => {
            const value = input[key];
            if (result[key]) {
                result[key] += value;
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }, {});
};
exports.totalAgent = totalAgent;
