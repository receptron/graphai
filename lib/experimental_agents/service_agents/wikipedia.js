"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikipediaAgent = void 0;
const wikipedia_1 = __importDefault(require("wikipedia"));
const wikipediaAgent = async ({ inputs, params }) => {
    const { lang, summary } = params;
    const query = inputs[0];
    try {
        if (lang) {
            wikipedia_1.default.setLang(lang);
        }
        const search = await wikipedia_1.default.search(query);
        const search_res = search.results[0];
        const page = await wikipedia_1.default.page(search_res["title"]);
        const content = await (summary ? page.summary() : page.content());
        return { content, ...search.results[0] };
    }
    catch (error) {
        console.log(error);
        //=> Typeof wikiError
    }
    return;
};
exports.wikipediaAgent = wikipediaAgent;
const wikipediaAgentInfo = {
    name: "wikipediaAgent",
    agent: exports.wikipediaAgent,
    mock: exports.wikipediaAgent,
    description: "Retrieves data from wikipedia",
    category: ["service"],
    samples: [],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = wikipediaAgentInfo;
