"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rssAgent = void 0;
const xml2js_1 = require("xml2js");
const rssAgent = async ({ inputs }) => {
    const url = inputs[0];
    try {
        const response = await fetch(url);
        const xmlData = await response.text();
        const jsonData = await (0, xml2js_1.parseStringPromise)(xmlData, { explicitArray: false, mergeAttrs: true });
        return jsonData;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.rssAgent = rssAgent;
const rssAgentInfo = {
    name: "rssAgent",
    agent: exports.rssAgent,
    mock: exports.rssAgent,
    description: "Retrieves XML data from RSS feed and convert it to JSON",
    category: ["data"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = rssAgentInfo;
