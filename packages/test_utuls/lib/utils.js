"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anonymization = void 0;
const anonymization = (data) => {
    return JSON.parse(JSON.stringify(data));
};
exports.anonymization = anonymization;
