"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmMetaDataFirstTokenTime = exports.llmMetaDataEndTime = exports.initLLMMetaData = exports.convertMeta = exports.getMessages = exports.getMergeValue = exports.flatString = void 0;
const flatString = (input) => {
    return Array.isArray(input) ? input.filter((a) => a).join("\n") : (input ?? "");
};
exports.flatString = flatString;
const getMergeValue = (namedInputs, params, key, values) => {
    const inputValue = namedInputs[key];
    const paramsValue = params[key];
    return inputValue || paramsValue ? [(0, exports.flatString)(inputValue), (0, exports.flatString)(paramsValue)].filter((a) => a).join("\n") : (0, exports.flatString)(values);
};
exports.getMergeValue = getMergeValue;
const getMessages = (systemPrompt, messages) => {
    const messagesCopy = [...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []), ...(messages ?? [])];
    return messagesCopy;
};
exports.getMessages = getMessages;
//
const convertMeta = (llmMetaData) => {
    const { start, firstToken, end } = llmMetaData.timing;
    const latencyToFirstToken = firstToken ? firstToken - start : undefined;
    const duration = firstToken ? end - firstToken : undefined;
    const totalElapsed = end - start;
    return {
        timing: {
            start: new Date(start).toISOString(),
            firstToken: firstToken ? new Date(firstToken).toISOString() : undefined,
            end: new Date(end).toISOString(),
            latencyToFirstToken,
            duration,
            totalElapsed,
        },
    };
};
exports.convertMeta = convertMeta;
const initLLMMetaData = () => {
    const llmMetaData = { timing: { start: Date.now(), end: 0, totalElapsed: 0 } };
    return llmMetaData;
};
exports.initLLMMetaData = initLLMMetaData;
const llmMetaDataEndTime = (llmMetaData) => {
    llmMetaData.timing.end = Date.now();
};
exports.llmMetaDataEndTime = llmMetaDataEndTime;
const llmMetaDataFirstTokenTime = (llmMetaData) => {
    if (llmMetaData.timing.firstToken === undefined) {
        llmMetaData.timing.firstToken = Date.now();
    }
};
exports.llmMetaDataFirstTokenTime = llmMetaDataFirstTokenTime;
