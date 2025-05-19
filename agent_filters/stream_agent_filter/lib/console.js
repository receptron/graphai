"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleStreamAgentFilter = exports.consoleStreamDataAgentFilter = void 0;
const stream_1 = require("./stream");
exports.consoleStreamDataAgentFilter = (0, stream_1.streamAgentFilterGenerator)((context, data) => {
    if (data.type === "response.in_progress") {
        console.log(data.response.output[0].text);
    }
});
exports.consoleStreamAgentFilter = (0, stream_1.streamAgentFilterGenerator)((context, data) => {
    console.log(data);
});
