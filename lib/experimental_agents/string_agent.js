"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
const stringTemplateAgent = async ({ nodeId, params, inputs, verbose }) => {
    if (verbose) {
        console.log("executing", nodeId, params);
    }
    const content = inputs.reduce((template, input, index) => {
        return template.replace("${" + index + "}", input[params.inputKey ?? "content"]);
    }, params.template);
    return { content };
};
exports.stringTemplateAgent = stringTemplateAgent;
