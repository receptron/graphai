"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMergeValue = exports.flatString = void 0;
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
