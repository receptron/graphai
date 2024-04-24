"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSumTemplateAgentInfo = exports.dataSumTemplateAgent = void 0;
const dataSumTemplateAgent = async ({ inputs }) => {
    return inputs.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
};
exports.dataSumTemplateAgent = dataSumTemplateAgent;
exports.dataSumTemplateAgentInfo = {
    name: "dataSumTemplateAgent",
    agent: exports.dataSumTemplateAgent,
    mock: exports.dataSumTemplateAgent,
};
exports.default = exports.dataSumTemplateAgentInfo;
