"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNodeName = void 0;
const parseNodeName = (name) => {
    const parts = name.split(".");
    if (parts.length == 1) {
        return { sourceNodeId: parts[0] };
    }
    else {
        return { sourceNodeId: parts[0], propId: parts[1] };
    }
};
exports.parseNodeName = parseNodeName;
