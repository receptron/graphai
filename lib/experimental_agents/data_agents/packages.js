"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSumTemplateAgent = exports.dataObjectMergeTemplateAgent = exports.totalAgent = void 0;
const total_agent_1 = __importDefault(require("../../experimental_agents/data_agents/total_agent"));
exports.totalAgent = total_agent_1.default;
const data_object_merge_template_agent_1 = __importDefault(require("../../experimental_agents/data_agents/data_object_merge_template_agent"));
exports.dataObjectMergeTemplateAgent = data_object_merge_template_agent_1.default;
const data_sum_template_agent_1 = __importDefault(require("../../experimental_agents/data_agents/data_sum_template_agent"));
exports.dataSumTemplateAgent = data_sum_template_agent_1.default;
