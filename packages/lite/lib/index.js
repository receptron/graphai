"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computed = void 0;
const computed = async (nodes, func) => {
    const results = await Promise.all(nodes);
    return func(...results);
};
exports.computed = computed;
