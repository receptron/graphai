"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleStreamAgentFilter = exports.consoleStreamDataAgentFilter = void 0;
const stream_1 = require("./stream");
exports.consoleStreamDataAgentFilter = (0, stream_1.streamAgentFilterGenerator)((context, data) => {
    if (data.type === "response.in_progress") {
        process.stdout.write(String(data.response.output[0].text));
    }
    else if (data.type === "response.completed") {
        process.stdout.write(String("\n"));
    }
});
exports.consoleStreamAgentFilter = (0, stream_1.streamAgentFilterGenerator)((context, data) => {
    process.stdout.write(String(data));
});
