"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
const stringTemplateAgent = async (context) => {
    console.log("executing", context.nodeId, context.params);
    const content = context.inputs.reduce((template, input, index) => {
        return template.replace("${" + index + "}", input[context.params.inputKey ?? "content"]);
    }, context.params.template);
    return { content };
};
exports.stringTemplateAgent = stringTemplateAgent;
