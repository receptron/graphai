"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTemplateAgent = void 0;
// see example
//  tests/agents/test_string_agent.ts
const stringTemplateAgent = async ({ params, inputs }) => {
    const content = inputs.reduce((template, input, index) => {
        return template.replace("${" + index + "}", input);
    }, params.template);
    return { content };
};
exports.stringTemplateAgent = stringTemplateAgent;
