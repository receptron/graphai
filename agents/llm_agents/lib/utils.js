"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMergeValue = void 0;
const flatString = (input) => {
    return Array.isArray(input) ? input.filter((a) => a).join("\n") : (input ?? "");
};
const getMergeValue = (namedInputs, params, key, values) => {
    const inputValue = namedInputs[key];
    const paramsValue = params[key];
    return inputValue || paramsValue ? [flatString(inputValue), flatString(paramsValue)].filter((a) => a).join("\n") : flatString(values);
};
exports.getMergeValue = getMergeValue;
