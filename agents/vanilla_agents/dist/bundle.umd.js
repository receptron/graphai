(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('worker_threads')) :
	typeof define === 'function' && define.amd ? define(['worker_threads'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GraphAIVanillaAgents = factory(global.require$$1));
})(this, (function (require$$1) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var lib$1 = {};

	var vanilla$5 = {};

	var string_splitter_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.stringSplitterAgent = void 0;
		// This agent strip one long string into chunks using following parameters
		//
		//  chunkSize: number; // default is 2048
		//  overlap: number;   // default is 1/8th of chunkSize.
		//
		// see example
		//  tests/agents/test_string_agent.ts
		//
		const defaultChunkSize = 2048;
		const stringSplitterAgent = async ({ params, inputs }) => {
		    const source = inputs[0];
		    const chunkSize = params.chunkSize ?? defaultChunkSize;
		    const overlap = params.overlap ?? Math.floor(chunkSize / 8);
		    const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
		    const contents = new Array(count).fill(undefined).map((_, i) => {
		        const startIndex = i * (chunkSize - overlap);
		        return source.substring(startIndex, startIndex + chunkSize);
		    });
		    return { contents, count, chunkSize, overlap };
		};
		exports.stringSplitterAgent = stringSplitterAgent;
		// for test and document
		const sampleInput = [
		    "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do.",
		];
		const sampleParams = { chunkSize: 64 };
		const sampleResult = {
		    contents: [
		        "Here's to the crazy ones, the misfits, the rebels, the troublema",
		        "roublemakers, the round pegs in the square holes ... the ones wh",
		        " ones who see things differently -- they're not fond of rules, a",
		        "rules, and they have no respect for the status quo. ... You can ",
		        "You can quote them, disagree with them, glorify or vilify them, ",
		        "y them, but the only thing you can't do is ignore them because t",
		        "ecause they change things. ... They push the human race forward,",
		        "forward, and while some may see them as the crazy ones, we see g",
		        "we see genius, because the people who are crazy enough to think ",
		        "o think that they can change the world, are the ones who do.",
		        " do.",
		    ],
		    count: 11,
		    chunkSize: 64,
		    overlap: 8,
		};
		const stringSplitterAgentInfo = {
		    name: "stringSplitterAgent",
		    agent: exports.stringSplitterAgent,
		    mock: exports.stringSplitterAgent,
		    samples: [
		        {
		            inputs: sampleInput,
		            params: sampleParams,
		            result: sampleResult,
		        },
		    ],
		    description: "This agent strip one long string into chunks using following parameters",
		    category: ["string"],
		    author: "Satoshi Nakajima",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = stringSplitterAgentInfo; 
	} (string_splitter_agent));

	var string_template_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.stringTemplateAgent = void 0;
		const processTemplate = (template, match, input) => {
		    if (typeof template === "string") {
		        return template.replace(match, input);
		    }
		    else if (Array.isArray(template)) {
		        return template.map((item) => processTemplate(item, match, input));
		    }
		    return Object.keys(template).reduce((tmp, key) => {
		        tmp[key] = processTemplate(template[key], match, input);
		        return tmp;
		    }, {});
		};
		const stringTemplateAgent = async ({ params, inputs }) => {
		    if (params.template === undefined) {
		        console.warn("warning: stringTemplateAgent no template");
		    }
		    return inputs.reduce((template, input, index) => {
		        return processTemplate(template, "${" + index + "}", input);
		    }, params.template);
		};
		exports.stringTemplateAgent = stringTemplateAgent;
		const sampleInput = ["hello", "test"];
		// for test and document
		const stringTemplateAgentInfo = {
		    name: "stringTemplateAgent",
		    agent: exports.stringTemplateAgent,
		    mock: exports.stringTemplateAgent,
		    samples: [
		        {
		            inputs: sampleInput,
		            params: { template: "${0}: ${1}" },
		            result: "hello: test",
		        },
		        {
		            inputs: sampleInput,
		            params: { template: ["${0}: ${1}", "${1}: ${0}"] },
		            result: ["hello: test", "test: hello"],
		        },
		        {
		            inputs: sampleInput,
		            params: { template: { apple: "${0}", lemon: "${1}" } },
		            result: { apple: "hello", lemon: "test" },
		        },
		        {
		            inputs: sampleInput,
		            params: { template: [{ apple: "${0}", lemon: "${1}" }] },
		            result: [{ apple: "hello", lemon: "test" }],
		        },
		        {
		            inputs: sampleInput,
		            params: { template: { apple: "${0}", lemon: ["${1}"] } },
		            result: { apple: "hello", lemon: ["test"] },
		        },
		    ],
		    description: "Template agent",
		    category: ["string"],
		    author: "Satoshi Nakajima",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = stringTemplateAgentInfo; 
	} (string_template_agent));

	var json_parser_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.jsonParserAgent = void 0;
		const jsonParserAgent = async ({ params, inputs }) => {
		    if (params.stringify) {
		        return JSON.stringify(inputs[0], null, 2);
		    }
		    const match = ("\n" + inputs[0]).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
		    if (match) {
		        return JSON.parse(match[1]);
		    }
		    return JSON.parse(inputs[0]);
		};
		exports.jsonParserAgent = jsonParserAgent;
		const sample_object = { apple: "red", lemon: "yellow" };
		// for test and document
		const jsonParserAgentInfo = {
		    name: "jsonParserAgent",
		    agent: exports.jsonParserAgent,
		    mock: exports.jsonParserAgent,
		    samples: [
		        {
		            inputs: [sample_object],
		            params: { stringify: true },
		            result: JSON.stringify(sample_object, null, 2),
		        },
		        {
		            inputs: [JSON.stringify(sample_object, null, 2)],
		            params: {},
		            result: sample_object,
		        },
		    ],
		    description: "Template agent",
		    category: ["string"],
		    author: "Satoshi Nakajima",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = jsonParserAgentInfo; 
	} (json_parser_agent));

	var __importDefault$4 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(vanilla$5, "__esModule", { value: true });
	vanilla$5.jsonParserAgent = vanilla$5.stringTemplateAgent = vanilla$5.stringSplitterAgent = void 0;
	const string_splitter_agent_1 = __importDefault$4(string_splitter_agent);
	vanilla$5.stringSplitterAgent = string_splitter_agent_1.default;
	const string_template_agent_1 = __importDefault$4(string_template_agent);
	vanilla$5.stringTemplateAgent = string_template_agent_1.default;
	const json_parser_agent_1 = __importDefault$4(json_parser_agent);
	vanilla$5.jsonParserAgent = json_parser_agent_1.default;

	var vanilla$4 = {};

	var push_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.pushAgent = void 0;
		const pushAgent = async ({ inputs }) => {
		    const array = inputs[0].map((item) => item); // shallow copy
		    inputs.forEach((input, index) => {
		        if (index > 0) {
		            array.push(input);
		        }
		    });
		    return array;
		};
		exports.pushAgent = pushAgent;
		const pushAgentInfo = {
		    name: "pushAgent",
		    agent: exports.pushAgent,
		    mock: exports.pushAgent,
		    samples: [
		        {
		            inputs: [[1, 2], 3],
		            params: {},
		            result: [1, 2, 3],
		        },
		        {
		            inputs: [[1, 2], 3, 4, 5],
		            params: {},
		            result: [1, 2, 3, 4, 5],
		        },
		        {
		            inputs: [[{ apple: 1 }], { lemon: 2 }],
		            params: {},
		            result: [{ apple: 1 }, { lemon: 2 }],
		        },
		    ],
		    description: "push Agent",
		    category: ["array"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = pushAgentInfo; 
	} (push_agent));

	var pop_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.popAgent = void 0;
		const popAgent = async (context) => {
		    const { inputs } = context;
		    const array = inputs[0].map((item) => item); // shallow copy
		    const item = array.pop();
		    return { array, item };
		};
		exports.popAgent = popAgent;
		const popAgentInfo = {
		    name: "popAgent",
		    agent: exports.popAgent,
		    mock: exports.popAgent,
		    samples: [
		        {
		            inputs: [[1, 2, 3]],
		            params: {},
		            result: {
		                array: [1, 2],
		                item: 3,
		            },
		        },
		        {
		            inputs: [["a", "b", "c"]],
		            params: {},
		            result: {
		                array: ["a", "b"],
		                item: "c",
		            },
		        },
		        {
		            inputs: [
		                [1, 2, 3],
		                ["a", "b", "c"],
		            ],
		            params: {},
		            result: {
		                array: [1, 2],
		                item: 3,
		            },
		        },
		    ],
		    description: "Pop Agent",
		    category: ["array"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = popAgentInfo; 
	} (pop_agent));

	var shift_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.shiftAgent = void 0;
		const shiftAgent = async (context) => {
		    const { inputs } = context;
		    const array = inputs[0].map((item) => item); // shallow copy
		    const item = array.shift();
		    return { array, item };
		};
		exports.shiftAgent = shiftAgent;
		const shiftAgentInfo = {
		    name: "shiftAgent",
		    agent: exports.shiftAgent,
		    mock: exports.shiftAgent,
		    samples: [
		        {
		            inputs: [[1, 2, 3]],
		            params: {},
		            result: {
		                array: [2, 3],
		                item: 1,
		            },
		        },
		        {
		            inputs: [["a", "b", "c"]],
		            params: {},
		            result: {
		                array: ["b", "c"],
		                item: "a",
		            },
		        },
		    ],
		    description: "shift Agent",
		    category: ["array"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = shiftAgentInfo; 
	} (shift_agent));

	var __importDefault$3 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(vanilla$4, "__esModule", { value: true });
	vanilla$4.shiftAgent = vanilla$4.popAgent = vanilla$4.pushAgent = void 0;
	const push_agent_1 = __importDefault$3(push_agent);
	vanilla$4.pushAgent = push_agent_1.default;
	const pop_agent_1 = __importDefault$3(pop_agent);
	vanilla$4.popAgent = pop_agent_1.default;
	const shift_agent_1 = __importDefault$3(shift_agent);
	vanilla$4.shiftAgent = shift_agent_1.default;

	var vanilla$3 = {};

	var dot_product_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.dotProductAgent = void 0;
		// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
		// typically used to calculate cosine similarity of embedding vectors.
		// Inputs:
		//  inputs[0]: Two dimentional array of numbers.
		//  inputs[1]: One dimentional array of numbers.
		// Outputs:
		//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
		const dotProductAgent = async ({ inputs }) => {
		    const embeddings = inputs[0];
		    const reference = inputs[1];
		    if (embeddings[0].length != reference.length) {
		        throw new Error(`dotProduct: Length of vectors do not match. ${embeddings[0].length}, ${reference.length}`);
		    }
		    const contents = embeddings.map((embedding) => {
		        return embedding.reduce((dotProduct, value, index) => {
		            return dotProduct + value * reference[index];
		        }, 0);
		    });
		    return contents;
		};
		exports.dotProductAgent = dotProductAgent;
		const dotProductAgentInfo = {
		    name: "dotProductAgent",
		    agent: exports.dotProductAgent,
		    mock: exports.dotProductAgent,
		    samples: [
		        {
		            inputs: [
		                [
		                    [1, 2],
		                    [3, 4],
		                    [5, 6],
		                ],
		                [3, 2],
		            ],
		            params: {},
		            result: [7, 17, 27],
		        },
		        {
		            inputs: [
		                [
		                    [1, 2],
		                    [2, 3],
		                ],
		                [1, 2],
		            ],
		            params: {},
		            result: [5, 8],
		        },
		    ],
		    description: "dotProduct Agent",
		    category: ["matrix"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = dotProductAgentInfo; 
	} (dot_product_agent));

	var sort_by_values_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.sortByValuesAgent = void 0;
		// This agent returned a sorted array of one array (A) based on another array (B).
		// The default sorting order is "decendant".
		//
		// Parameters:
		//  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
		// Inputs:
		//  inputs[0]: Array<any>; // array to be sorted
		//  inputs[1]: Array<number>; // array of numbers for sorting
		//
		const sortByValuesAgent = async ({ params, inputs }) => {
		    const direction = params?.assendant ?? false ? -1 : 1;
		    const sources = inputs[0];
		    const values = inputs[1];
		    const joined = sources.map((item, index) => {
		        return { item, value: values[index] };
		    });
		    const contents = joined
		        .sort((a, b) => {
		        return (b.value - a.value) * direction;
		    })
		        .map((a) => {
		        return a.item;
		    });
		    return contents;
		};
		exports.sortByValuesAgent = sortByValuesAgent;
		const sortByValuesAgentInfo = {
		    name: "sortByValuesAgent",
		    agent: exports.sortByValuesAgent,
		    mock: exports.sortByValuesAgent,
		    samples: [
		        {
		            inputs: [
		                ["banana", "orange", "lemon", "apple"],
		                [2, 5, 6, 4],
		            ],
		            params: {},
		            result: ["lemon", "orange", "apple", "banana"],
		        },
		        {
		            inputs: [
		                ["banana", "orange", "lemon", "apple"],
		                [2, 5, 6, 4],
		            ],
		            params: {
		                assendant: true,
		            },
		            result: ["banana", "apple", "orange", "lemon"],
		        },
		    ],
		    description: "sortByValues Agent",
		    category: ["matrix"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = sortByValuesAgentInfo; 
	} (sort_by_values_agent));

	var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(vanilla$3, "__esModule", { value: true });
	vanilla$3.sortByValuesAgent = vanilla$3.dotProductAgent = void 0;
	const dot_product_agent_1 = __importDefault$2(dot_product_agent);
	vanilla$3.dotProductAgent = dot_product_agent_1.default;
	const sort_by_values_agent_1 = __importDefault$2(sort_by_values_agent);
	vanilla$3.sortByValuesAgent = sort_by_values_agent_1.default;

	var vanilla$2 = {};

	var echo_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.echoAgent = void 0;
		const echoAgent = async ({ params, filterParams }) => {
		    if (params.filterParams) {
		        return filterParams;
		    }
		    return params;
		};
		exports.echoAgent = echoAgent;
		// for test and document
		const echoAgentInfo = {
		    name: "echoAgent",
		    agent: exports.echoAgent,
		    mock: exports.echoAgent,
		    samples: [
		        {
		            inputs: [],
		            params: { message: "this is test" },
		            result: { message: "this is test" },
		        },
		        {
		            inputs: [],
		            params: {
		                message: "If you add filterParams option, it will respond to filterParams",
		                filterParams: true,
		            },
		            result: {},
		        },
		    ],
		    description: "Echo agent",
		    category: ["test"],
		    author: "Satoshi Nakajima",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = echoAgentInfo; 
	} (echo_agent));

	var bypass_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.bypassAgent = void 0;
		const bypassAgent = async ({ params, inputs }) => {
		    if (params && params.firstElement) {
		        return inputs[0];
		    }
		    if (params && params.flat) {
		        return inputs.flat(params.flat || 1);
		    }
		    return inputs;
		};
		exports.bypassAgent = bypassAgent;
		// for test and document
		const bypassAgentInfo = {
		    name: "bypassAgent",
		    agent: exports.bypassAgent,
		    mock: exports.bypassAgent,
		    samples: [
		        {
		            inputs: [{ a: "123" }],
		            params: {},
		            result: [{ a: "123" }],
		        },
		        {
		            inputs: [
		                [{ a: "123" }, { b: "abc" }],
		                [{ c: "987" }, { d: "xyz" }],
		            ],
		            params: {},
		            result: [
		                [{ a: "123" }, { b: "abc" }],
		                [{ c: "987" }, { d: "xyz" }],
		            ],
		        },
		        {
		            inputs: [
		                [{ a: "123" }, { b: "abc" }],
		                [{ c: "987" }, { d: "xyz" }],
		            ],
		            params: { firstElement: true },
		            result: [{ a: "123" }, { b: "abc" }],
		        },
		        {
		            inputs: [
		                [{ a: "123" }, { b: "abc" }],
		                [{ c: "987" }, { d: "xyz" }],
		            ],
		            params: { flat: 1 },
		            result: [{ a: "123" }, { b: "abc" }, { c: "987" }, { d: "xyz" }],
		        },
		    ],
		    description: "bypass agent",
		    category: ["test"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = bypassAgentInfo; 
	} (bypass_agent));

	var counting_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.countingAgent = void 0;
		const countingAgent = async ({ params }) => {
		    return {
		        list: new Array(params.count).fill(undefined).map((_, i) => {
		            return i;
		        }),
		    };
		};
		exports.countingAgent = countingAgent;
		// for test and document
		const countingAgentInfo = {
		    name: "countingAgent",
		    agent: exports.countingAgent,
		    mock: exports.countingAgent,
		    samples: [
		        {
		            inputs: [],
		            params: { count: 4 },
		            result: { list: [0, 1, 2, 3] },
		        },
		    ],
		    description: "Counting agent",
		    category: ["test"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = countingAgentInfo; 
	} (counting_agent));

	var copy_message_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.copyMessageAgent = void 0;
		const copyMessageAgent = async ({ params }) => {
		    return {
		        messages: new Array(params.count).fill(undefined).map(() => {
		            return params.message;
		        }),
		    };
		};
		exports.copyMessageAgent = copyMessageAgent;
		// for test and document
		const copyMessageAgentInfo = {
		    name: "copyMessageAgent",
		    agent: exports.copyMessageAgent,
		    mock: exports.copyMessageAgent,
		    samples: [
		        {
		            inputs: [],
		            params: { count: 4, message: "hello" },
		            result: { messages: ["hello", "hello", "hello", "hello"] },
		        },
		    ],
		    description: "CopyMessage agent",
		    category: ["test"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = copyMessageAgentInfo; 
	} (copy_message_agent));

	var copy2array_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.copy2ArrayAgent = void 0;
		const copy2ArrayAgent = async ({ inputs, params }) => {
		    return new Array(params.count).fill(undefined).map(() => {
		        return inputs[0];
		    });
		};
		exports.copy2ArrayAgent = copy2ArrayAgent;
		// for test and document
		const copy2ArrayAgentInfo = {
		    name: "copy2ArrayAgent",
		    agent: exports.copy2ArrayAgent,
		    mock: exports.copy2ArrayAgent,
		    samples: [
		        {
		            inputs: [{ message: "hello" }],
		            params: { count: 10 },
		            result: [
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		                { message: "hello" },
		            ],
		        },
		    ],
		    description: "Copy2Array agent",
		    category: ["test"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = copy2ArrayAgentInfo; 
	} (copy2array_agent));

	var merge_node_id_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.mergeNodeIdAgent = void 0;
		const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, inputs }) => {
		    // console.log("executing", nodeId);
		    return inputs.reduce((tmp, input) => {
		        return { ...tmp, ...input };
		    }, { [nodeId]: "hello" });
		};
		exports.mergeNodeIdAgent = mergeNodeIdAgent;
		// for test and document
		const mergeNodeIdAgentInfo = {
		    name: "mergeNodeIdAgent",
		    agent: exports.mergeNodeIdAgent,
		    mock: exports.mergeNodeIdAgent,
		    samples: [
		        {
		            inputs: [{ message: "hello" }],
		            params: {},
		            result: {
		                message: "hello",
		                test: "hello",
		            },
		        },
		    ],
		    description: "merge node id agent",
		    category: ["test"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = mergeNodeIdAgentInfo; 
	} (merge_node_id_agent));

	var stream_mock_agent = {};

	var utils = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.defaultTestContext = exports.isLogicallyTrue = exports.debugResultKey = exports.agentInfoWrapper = exports.defaultAgentInfo = exports.strIntentionalError = exports.getDataFromSource = exports.isObject = exports.assert = exports.parseNodeName = exports.sleep = void 0;
		const sleep = async (milliseconds) => {
		    return await new Promise((resolve) => setTimeout(resolve, milliseconds));
		};
		exports.sleep = sleep;
		const parseNodeName_02 = (inputNodeId) => {
		    if (typeof inputNodeId === "string") {
		        const regex = /^"(.*)"$/;
		        const match = inputNodeId.match(regex);
		        if (match) {
		            return { value: match[1] }; // string literal
		        }
		        const parts = inputNodeId.split(".");
		        if (parts.length == 1) {
		            return { nodeId: parts[0] };
		        }
		        return { nodeId: parts[0], propIds: parts.slice(1) };
		    }
		    return { value: inputNodeId }; // non-string literal
		};
		const parseNodeName = (inputNodeId, version) => {
		    if (version === 0.2) {
		        return parseNodeName_02(inputNodeId);
		    }
		    if (typeof inputNodeId === "string") {
		        const regex = /^:(.*)$/;
		        const match = inputNodeId.match(regex);
		        if (!match) {
		            return { value: inputNodeId }; // string literal
		        }
		        const parts = match[1].split(".");
		        if (parts.length == 1) {
		            return { nodeId: parts[0] };
		        }
		        return { nodeId: parts[0], propIds: parts.slice(1) };
		    }
		    return { value: inputNodeId }; // non-string literal
		};
		exports.parseNodeName = parseNodeName;
		function assert(condition, message, isWarn = false) {
		    if (!condition) {
		        if (!isWarn) {
		            throw new Error(message);
		        }
		        console.warn("warn: " + message);
		    }
		}
		exports.assert = assert;
		const isObject = (x) => {
		    return x !== null && typeof x === "object";
		};
		exports.isObject = isObject;
		const getNestedData = (result, propId) => {
		    if (Array.isArray(result)) {
		        const regex = /^\$(\d+)$/;
		        const match = propId.match(regex);
		        if (match) {
		            const index = parseInt(match[1], 10);
		            return result[index];
		        }
		        if (propId === "$last") {
		            return result[result.length - 1];
		        }
		    }
		    else if ((0, exports.isObject)(result)) {
		        return result[propId];
		    }
		    return undefined;
		};
		const innerGetDataFromSource = (result, propIds) => {
		    if (result && propIds && propIds.length > 0) {
		        const propId = propIds[0];
		        const ret = getNestedData(result, propId);
		        if (propIds.length > 1) {
		            return innerGetDataFromSource(ret, propIds.slice(1));
		        }
		        return ret;
		    }
		    return result;
		};
		const getDataFromSource = (result, source) => {
		    if (!source.nodeId) {
		        return source.value;
		    }
		    return innerGetDataFromSource(result, source.propIds);
		};
		exports.getDataFromSource = getDataFromSource;
		exports.strIntentionalError = "Intentional Error for Debugging";
		exports.defaultAgentInfo = {
		    name: "defaultAgentInfo",
		    samples: [
		        {
		            inputs: [],
		            params: {},
		            result: {},
		        },
		    ],
		    description: "",
		    category: [],
		    author: "",
		    repository: "",
		    license: "",
		};
		const agentInfoWrapper = (agent) => {
		    return {
		        agent,
		        mock: agent,
		        ...exports.defaultAgentInfo,
		    };
		};
		exports.agentInfoWrapper = agentInfoWrapper;
		const objectToKeyArray = (innerData) => {
		    const ret = [];
		    Object.keys(innerData).forEach((key) => {
		        ret.push([key]);
		        if (Object.keys(innerData[key]).length > 0) {
		            objectToKeyArray(innerData[key]).forEach((tmp) => {
		                ret.push([key, ...tmp]);
		            });
		        }
		    });
		    return ret;
		};
		const debugResultKey = (agentId, result) => {
		    return objectToKeyArray({ [agentId]: debugResultKeyInner(result) }).map((objectKeys) => {
		        return ":" + objectKeys.join(".");
		    });
		};
		exports.debugResultKey = debugResultKey;
		const debugResultKeyInner = (result) => {
		    if (result === null || result === undefined) {
		        return {};
		    }
		    if (typeof result === "string") {
		        return {};
		    }
		    if (Array.isArray(result)) {
		        return Array.from(result.keys()).reduce((tmp, index) => {
		            tmp["$" + String(index)] = debugResultKeyInner(result[index]);
		            return tmp;
		        }, {});
		    }
		    return Object.keys(result).reduce((tmp, key) => {
		        tmp[key] = debugResultKeyInner(result[key]);
		        return tmp;
		    }, {});
		};
		const isLogicallyTrue = (value) => {
		    // Notice that empty aray is not true under GraphAI
		    if (Array.isArray(value) ? value.length === 0 : !value) {
		        return false;
		    }
		    return true;
		};
		exports.isLogicallyTrue = isLogicallyTrue;
		exports.defaultTestContext = {
		    debugInfo: {
		        nodeId: "test",
		        retry: 0,
		        verbose: true,
		    },
		    params: {},
		    filterParams: {},
		    agents: {},
		    log: [],
		}; 
	} (utils));

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.streamMockAgent = void 0;
		const utils_1 = utils;
		const streamMockAgent = async ({ params, filterParams }) => {
		    const message = params.message || "";
		    for await (const token of message.split("")) {
		        if (filterParams.streamTokenCallback) {
		            filterParams.streamTokenCallback(token);
		        }
		        await (0, utils_1.sleep)(params.sleep || 100);
		    }
		    return params;
		};
		exports.streamMockAgent = streamMockAgent;
		// for test and document
		const streamMockAgentInfo = {
		    name: "streamMockAgent",
		    agent: exports.streamMockAgent,
		    mock: exports.streamMockAgent,
		    samples: [
		        {
		            inputs: [],
		            params: { message: "this is test" },
		            result: { message: "this is test" },
		        },
		    ],
		    description: "Stream mock agent",
		    category: ["test"],
		    author: "Isamu Arimoto",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		    stream: true,
		};
		exports.default = streamMockAgentInfo; 
	} (stream_mock_agent));

	var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(vanilla$2, "__esModule", { value: true });
	vanilla$2.streamMockAgent = vanilla$2.mergeNodeIdAgent = vanilla$2.copy2ArrayAgent = vanilla$2.copyMessageAgent = vanilla$2.countingAgent = vanilla$2.bypassAgent = vanilla$2.echoAgent = void 0;
	const echo_agent_1 = __importDefault$1(echo_agent);
	vanilla$2.echoAgent = echo_agent_1.default;
	const bypass_agent_1 = __importDefault$1(bypass_agent);
	vanilla$2.bypassAgent = bypass_agent_1.default;
	const counting_agent_1 = __importDefault$1(counting_agent);
	vanilla$2.countingAgent = counting_agent_1.default;
	const copy_message_agent_1 = __importDefault$1(copy_message_agent);
	vanilla$2.copyMessageAgent = copy_message_agent_1.default;
	const copy2array_agent_1 = __importDefault$1(copy2array_agent);
	vanilla$2.copy2ArrayAgent = copy2array_agent_1.default;
	const merge_node_id_agent_1 = __importDefault$1(merge_node_id_agent);
	vanilla$2.mergeNodeIdAgent = merge_node_id_agent_1.default;
	const stream_mock_agent_1 = __importDefault$1(stream_mock_agent);
	vanilla$2.streamMockAgent = stream_mock_agent_1.default;

	var vanilla$1 = {};

	var nested_agent = {};

	var lib = {};

	var graphai = {};

	var node = {};

	var type = {};

	Object.defineProperty(type, "__esModule", { value: true });
	type.NodeState = void 0;
	var NodeState;
	(function (NodeState) {
	    NodeState["Waiting"] = "waiting";
	    NodeState["Queued"] = "queued";
	    NodeState["Executing"] = "executing";
	    NodeState["Failed"] = "failed";
	    NodeState["TimedOut"] = "timed-out";
	    NodeState["Completed"] = "completed";
	    NodeState["Injected"] = "injected";
	    NodeState["Skipped"] = "skipped";
	})(NodeState || (type.NodeState = NodeState = {}));

	var transaction_log = {};

	Object.defineProperty(transaction_log, "__esModule", { value: true });
	transaction_log.TransactionLog = void 0;
	const type_1$1 = type;
	const utils_1$4 = utils;
	class TransactionLog {
	    constructor(nodeId) {
	        this.nodeId = nodeId;
	        this.state = type_1$1.NodeState.Waiting;
	    }
	    initForComputedNode(node, graph) {
	        this.agentId = node.getAgentId();
	        this.params = node.params;
	        graph.appendLog(this);
	    }
	    onInjected(node, graph, injectFrom) {
	        const isUpdating = "endTime" in this;
	        this.result = node.result;
	        this.state = node.state;
	        this.endTime = Date.now();
	        this.injectFrom = injectFrom;
	        graph.setLoopLog(this);
	        // console.log(this)
	        if (isUpdating) {
	            graph.updateLog(this);
	        }
	        else {
	            graph.appendLog(this);
	        }
	    }
	    onComplete(node, graph, localLog) {
	        this.result = node.result;
	        this.resultKeys = (0, utils_1$4.debugResultKey)(this.agentId || "", node.result);
	        this.state = node.state;
	        this.endTime = Date.now();
	        graph.setLoopLog(this);
	        if (localLog.length > 0) {
	            this.log = localLog;
	        }
	        graph.updateLog(this);
	    }
	    beforeExecute(node, graph, transactionId, inputs) {
	        this.state = node.state;
	        this.retryCount = node.retryCount > 0 ? node.retryCount : undefined;
	        this.startTime = transactionId;
	        this.inputs = node.dataSources.filter((source) => source.nodeId).map((source) => source.nodeId);
	        this.inputsData = inputs.length > 0 ? inputs : undefined;
	        graph.setLoopLog(this);
	        graph.appendLog(this);
	    }
	    beforeAddTask(node, graph) {
	        this.state = node.state;
	        graph.setLoopLog(this);
	        graph.appendLog(this);
	    }
	    onError(node, graph, errorMessage) {
	        this.state = node.state;
	        this.errorMessage = errorMessage;
	        this.endTime = Date.now();
	        graph.setLoopLog(this);
	        graph.updateLog(this);
	    }
	    onSkipped(node, graph) {
	        this.state = node.state;
	        graph.setLoopLog(this);
	        graph.updateLog(this);
	    }
	}
	transaction_log.TransactionLog = TransactionLog;

	Object.defineProperty(node, "__esModule", { value: true });
	node.StaticNode = node.ComputedNode = node.Node = void 0;
	const utils_1$3 = utils;
	const type_1 = type;
	const utils_2 = utils;
	const transaction_log_1 = transaction_log;
	class Node {
	    constructor(nodeId, graph) {
	        this.waitlist = new Set(); // List of nodes which need data from this node.
	        this.state = type_1.NodeState.Waiting;
	        this.result = undefined;
	        this.nodeId = nodeId;
	        this.graph = graph;
	        this.log = new transaction_log_1.TransactionLog(nodeId);
	    }
	    asString() {
	        return `${this.nodeId}: ${this.state} ${[...this.waitlist]}`;
	    }
	    // This method is called either as the result of computation (computed node) or
	    // injection (static node).
	    onSetResult() {
	        this.waitlist.forEach((waitingNodeId) => {
	            const waitingNode = this.graph.nodes[waitingNodeId];
	            if (waitingNode.isComputedNode) {
	                waitingNode.removePending(this.nodeId);
	                this.graph.pushQueueIfReadyAndRunning(waitingNode);
	            }
	        });
	    }
	}
	node.Node = Node;
	class ComputedNode extends Node {
	    constructor(graphId, nodeId, data, graph) {
	        super(nodeId, graph);
	        this.retryCount = 0;
	        this.isStaticNode = false;
	        this.isComputedNode = true;
	        this.graphId = graphId;
	        this.params = data.params ?? {};
	        this.console = data.console ?? {};
	        this.filterParams = data.filterParams ?? {};
	        if (typeof data.agent === "string") {
	            this.agentId = data.agent;
	        }
	        else {
	            (0, utils_2.assert)(typeof data.agent === "function", "agent must be either string or function");
	            const agent = data.agent;
	            this.agentFunction = async ({ inputs }) => {
	                return agent(...inputs);
	            };
	        }
	        this.retryLimit = data.retry ?? graph.retryLimit ?? 0;
	        this.timeout = data.timeout;
	        this.isResult = data.isResult ?? false;
	        this.priority = data.priority ?? 0;
	        this.anyInput = data.anyInput ?? false;
	        this.dataSources = (data.inputs ?? []).map((input) => (0, utils_2.parseNodeName)(input, graph.version));
	        this.pendings = new Set(this.dataSources.filter((source) => source.nodeId).map((source) => source.nodeId));
	        if (typeof data.graph === "string") {
	            const source = (0, utils_2.parseNodeName)(data.graph, graph.version);
	            (0, utils_2.assert)(!!source.nodeId, `Invalid data source ${data.graph}`);
	            this.pendings.add(source.nodeId);
	            this.nestedGraph = source;
	        }
	        else if (data.graph) {
	            this.nestedGraph = data.graph;
	        }
	        if (data.if) {
	            this.ifSource = (0, utils_2.parseNodeName)(data.if, graph.version);
	            (0, utils_2.assert)(!!this.ifSource.nodeId, `Invalid data source ${data.if}`);
	            this.pendings.add(this.ifSource.nodeId);
	        }
	        if (data.unless) {
	            this.unlessSource = (0, utils_2.parseNodeName)(data.unless, graph.version);
	            (0, utils_2.assert)(!!this.unlessSource.nodeId, `Invalid data source ${data.unless}`);
	            this.pendings.add(this.unlessSource.nodeId);
	        }
	        this.dynamicParams = Object.keys(this.params).reduce((tmp, key) => {
	            const dataSource = (0, utils_2.parseNodeName)(this.params[key], graph.version < 0.3 ? 0.3 : graph.version);
	            if (dataSource.nodeId) {
	                (0, utils_2.assert)(!this.anyInput, "Dynamic params are not supported with anyInput");
	                tmp[key] = dataSource;
	                this.pendings.add(dataSource.nodeId);
	            }
	            return tmp;
	        }, {});
	        this.log.initForComputedNode(this, graph);
	    }
	    getAgentId() {
	        return this.agentId ?? "__custom__function"; // only for display purpose in the log.
	    }
	    isReadyNode() {
	        if (this.state === type_1.NodeState.Waiting && this.pendings.size === 0) {
	            // Count the number of data actually available.
	            // We care it only when this.anyInput is true.
	            // Notice that this logic enables dynamic data-flows.
	            const counter = this.dataSources.reduce((count, source) => {
	                const [result] = this.graph.resultsOf([source]);
	                return result === undefined ? count : count + 1;
	            }, 0);
	            if (!this.anyInput || counter > 0) {
	                if (this.ifSource) {
	                    const [condition] = this.graph.resultsOf([this.ifSource]);
	                    if (!(0, utils_2.isLogicallyTrue)(condition)) {
	                        this.state = type_1.NodeState.Skipped;
	                        this.log.onSkipped(this, this.graph);
	                        return false;
	                    }
	                }
	                if (this.unlessSource) {
	                    const [condition] = this.graph.resultsOf([this.unlessSource]);
	                    if ((0, utils_2.isLogicallyTrue)(condition)) {
	                        this.state = type_1.NodeState.Skipped;
	                        this.log.onSkipped(this, this.graph);
	                        return false;
	                    }
	                }
	                return true;
	            }
	        }
	        return false;
	    }
	    // This private method (only called while executing execute()) performs
	    // the "retry" if specified. The transaction log must be updated before
	    // callling this method.
	    retry(state, error) {
	        this.state = state; // this.execute() will update to NodeState.Executing
	        this.log.onError(this, this.graph, error.message);
	        if (this.retryCount < this.retryLimit) {
	            this.retryCount++;
	            this.execute();
	        }
	        else {
	            this.result = undefined;
	            this.error = error;
	            this.transactionId = undefined; // This is necessary for timeout case
	            this.graph.onExecutionComplete(this);
	        }
	    }
	    checkDataAvailability() {
	        (0, utils_2.assert)(this.anyInput, "checkDataAvailability should be called only for anyInput case");
	        const results = this.graph.resultsOf(this.dataSources).filter((result) => {
	            return result !== undefined;
	        });
	        return results.length > 0;
	    }
	    // This method is called right before the Graph add this node to the task manager.
	    beforeAddTask() {
	        this.state = type_1.NodeState.Queued;
	        this.log.beforeAddTask(this, this.graph);
	    }
	    // This method is called when the data became available on one of nodes,
	    // which this node needs data from.
	    removePending(nodeId) {
	        if (this.anyInput) {
	            if (this.checkDataAvailability()) {
	                this.pendings.clear();
	            }
	        }
	        else {
	            this.pendings.delete(nodeId);
	        }
	    }
	    isCurrentTransaction(transactionId) {
	        return this.transactionId === transactionId;
	    }
	    // This private method (called only fro execute) checks if the callback from
	    // the timer came before the completion of agent function call, record it
	    // and attempt to retry (if specified).
	    executeTimeout(transactionId) {
	        if (this.state === type_1.NodeState.Executing && this.isCurrentTransaction(transactionId)) {
	            console.warn(`-- timeout ${this.timeout} with ${this.nodeId}`);
	            this.retry(type_1.NodeState.TimedOut, Error("Timeout"));
	        }
	    }
	    // Check if we need to apply this filter to this node or not.
	    shouldApplyAgentFilter(agentFilter) {
	        if (agentFilter.agentIds && Array.isArray(agentFilter.agentIds) && agentFilter.agentIds.length > 0) {
	            if (this.agentId && agentFilter.agentIds.includes(this.agentId)) {
	                return true;
	            }
	        }
	        if (agentFilter.nodeIds && Array.isArray(agentFilter.nodeIds) && agentFilter.nodeIds.length > 0) {
	            if (agentFilter.nodeIds.includes(this.nodeId)) {
	                return true;
	            }
	        }
	        return !agentFilter.agentIds && !agentFilter.nodeIds;
	    }
	    agentFilterHandler(context, agentFunction) {
	        let index = 0;
	        const next = (innerContext) => {
	            const agentFilter = this.graph.agentFilters[index++];
	            if (agentFilter) {
	                if (this.shouldApplyAgentFilter(agentFilter)) {
	                    if (agentFilter.filterParams) {
	                        innerContext.filterParams = { ...agentFilter.filterParams, ...innerContext.filterParams };
	                    }
	                    return agentFilter.agent(innerContext, next);
	                }
	                return next(innerContext);
	            }
	            return agentFunction(innerContext);
	        };
	        return next(context);
	    }
	    // This method is called when this computed node became ready to run.
	    // It asynchronously calls the associated with agent function and set the result,
	    // then it removes itself from the "running node" list of the graph.
	    // Notice that setting the result of this node may make other nodes ready to run.
	    async execute() {
	        const previousResults = this.graph.resultsOf(this.dataSources).filter((result) => {
	            // Remove undefined if anyInput flag is set.
	            return !this.anyInput || result !== undefined;
	        });
	        const transactionId = Date.now();
	        this.prepareExecute(transactionId, previousResults);
	        if (this.timeout && this.timeout > 0) {
	            setTimeout(() => {
	                this.executeTimeout(transactionId);
	            }, this.timeout);
	        }
	        try {
	            const agentFunction = this.agentFunction ?? this.graph.getAgentFunctionInfo(this.agentId).agent;
	            const localLog = [];
	            const params = Object.keys(this.dynamicParams).reduce((tmp, key) => {
	                const [result] = this.graph.resultsOf([this.dynamicParams[key]]);
	                tmp[key] = result;
	                return tmp;
	            }, { ...this.params });
	            const context = {
	                params: params,
	                inputs: previousResults,
	                debugInfo: {
	                    nodeId: this.nodeId,
	                    agentId: this.agentId,
	                    retry: this.retryCount,
	                    verbose: this.graph.verbose,
	                },
	                filterParams: this.filterParams,
	                agentFilters: this.graph.agentFilters,
	                log: localLog,
	            };
	            // NOTE: We use the existence of graph object in the agent-specific params to determine
	            // if this is a nested agent or not.
	            if (this.nestedGraph) {
	                this.graph.taskManager.prepareForNesting();
	                context.taskManager = this.graph.taskManager;
	                if ("nodes" in this.nestedGraph) {
	                    context.graphData = this.nestedGraph;
	                }
	                else {
	                    const [graphData] = this.graph.resultsOf([this.nestedGraph]);
	                    context.graphData = graphData; // HACK: compiler work-around
	                }
	                context.agents = this.graph.agentFunctionInfoDictionary;
	            }
	            if (this.console.before) {
	                console.log(this.console.before === true ? JSON.stringify(context.inputs, null, 2) : this.console.before);
	            }
	            const result = await this.agentFilterHandler(context, agentFunction);
	            if (this.console.after) {
	                console.log(this.console.after === true ? (typeof result === "string" ? result : JSON.stringify(result, null, 2)) : this.console.after);
	            }
	            if (this.nestedGraph) {
	                this.graph.taskManager.restoreAfterNesting();
	            }
	            if (!this.isCurrentTransaction(transactionId)) {
	                // This condition happens when the agent function returns
	                // after the timeout (either retried or not).
	                console.log(`-- transactionId mismatch with ${this.nodeId} (probably timeout)`);
	                return;
	            }
	            this.state = type_1.NodeState.Completed;
	            this.result = result;
	            this.log.onComplete(this, this.graph, localLog);
	            this.onSetResult();
	            this.graph.onExecutionComplete(this);
	        }
	        catch (error) {
	            this.errorProcess(error, transactionId);
	        }
	    }
	    // This private method (called only by execute()) prepares the ComputedNode object
	    // for execution, and create a new transaction to record it.
	    prepareExecute(transactionId, inputs) {
	        this.state = type_1.NodeState.Executing;
	        this.log.beforeExecute(this, this.graph, transactionId, inputs);
	        this.transactionId = transactionId;
	    }
	    // This private method (called only by execute) processes an error received from
	    // the agent function. It records the error in the transaction log and handles
	    // the retry if specified.
	    errorProcess(error, transactionId) {
	        if (error instanceof Error && error.message !== utils_1$3.strIntentionalError) {
	            console.error(`<-- NodeId: ${this.nodeId}, Agent: ${this.agentId}`);
	            console.error(error);
	            console.error("-->");
	        }
	        if (!this.isCurrentTransaction(transactionId)) {
	            console.warn(`-- transactionId mismatch with ${this.nodeId} (not timeout)`);
	            return;
	        }
	        if (error instanceof Error) {
	            this.retry(type_1.NodeState.Failed, error);
	        }
	        else {
	            console.error(`-- NodeId: ${this.nodeId}: Unknown error was caught`);
	            this.retry(type_1.NodeState.Failed, Error("Unknown"));
	        }
	    }
	}
	node.ComputedNode = ComputedNode;
	class StaticNode extends Node {
	    constructor(nodeId, data, graph) {
	        super(nodeId, graph);
	        this.isStaticNode = true;
	        this.isComputedNode = false;
	        this.value = data.value;
	        this.update = data.update ? (0, utils_2.parseNodeName)(data.update, graph.version) : undefined;
	        this.isResult = data.isResult ?? false;
	    }
	    injectValue(value, injectFrom) {
	        this.state = type_1.NodeState.Injected;
	        this.result = value;
	        this.log.onInjected(this, this.graph, injectFrom);
	        this.onSetResult();
	    }
	}
	node.StaticNode = StaticNode;

	var validator = {};

	var graph_data_validator = {};

	var common = {};

	Object.defineProperty(common, "__esModule", { value: true });
	common.ValidationError = common.staticNodeAttributeKeys = common.computedNodeAttributeKeys = common.graphDataAttributeKeys = void 0;
	common.graphDataAttributeKeys = ["nodes", "concurrency", "agentId", "loop", "verbose", "version"];
	common.computedNodeAttributeKeys = [
	    "inputs",
	    "anyInput",
	    "params",
	    "retry",
	    "timeout",
	    "agent",
	    "graph",
	    "isResult",
	    "priority",
	    "if",
	    "unless",
	    "filterParams",
	    "console",
	];
	common.staticNodeAttributeKeys = ["value", "update", "isResult"];
	class ValidationError extends Error {
	    constructor(message) {
	        super(`\x1b[41m${message}\x1b[0m`); // Pass the message to the base Error class
	        // Set the prototype explicitly to ensure correct prototype chain
	        Object.setPrototypeOf(this, ValidationError.prototype);
	    }
	}
	common.ValidationError = ValidationError;

	Object.defineProperty(graph_data_validator, "__esModule", { value: true });
	graph_data_validator.graphDataValidator = graph_data_validator.graphNodesValidator = void 0;
	const common_1$5 = common;
	const graphNodesValidator = (data) => {
	    if (data.nodes === undefined) {
	        throw new common_1$5.ValidationError("Invalid Graph Data: no nodes");
	    }
	    if (typeof data.nodes !== "object") {
	        throw new common_1$5.ValidationError("Invalid Graph Data: invalid nodes");
	    }
	    if (Array.isArray(data.nodes)) {
	        throw new common_1$5.ValidationError("Invalid Graph Data: nodes must be object");
	    }
	    if (Object.keys(data.nodes).length === 0) {
	        throw new common_1$5.ValidationError("Invalid Graph Data: nodes is empty");
	    }
	    Object.keys(data).forEach((key) => {
	        if (!common_1$5.graphDataAttributeKeys.includes(key)) {
	            throw new common_1$5.ValidationError("Graph Data does not allow " + key);
	        }
	    });
	};
	graph_data_validator.graphNodesValidator = graphNodesValidator;
	const graphDataValidator = (data) => {
	    if (data.loop) {
	        if (data.loop.count === undefined && data.loop.while === undefined) {
	            throw new common_1$5.ValidationError("Loop: Either count or while is required in loop");
	        }
	        if (data.loop.count !== undefined && data.loop.while !== undefined) {
	            throw new common_1$5.ValidationError("Loop: Both count and while cannot be set");
	        }
	    }
	    if (data.concurrency !== undefined) {
	        if (!Number.isInteger(data.concurrency)) {
	            throw new common_1$5.ValidationError("Concurrency must be an integer");
	        }
	        if (data.concurrency < 1) {
	            throw new common_1$5.ValidationError("Concurrency must be a positive integer");
	        }
	    }
	};
	graph_data_validator.graphDataValidator = graphDataValidator;

	var nodeValidator$1 = {};

	Object.defineProperty(nodeValidator$1, "__esModule", { value: true });
	nodeValidator$1.nodeValidator = void 0;
	const common_1$4 = common;
	const nodeValidator = (nodeData) => {
	    if (nodeData.agent && nodeData.value) {
	        throw new common_1$4.ValidationError("Cannot set both agent and value");
	    }
	    if (!("agent" in nodeData) && !("value" in nodeData)) {
	        throw new common_1$4.ValidationError("Either agent or value is required");
	    }
	    return true;
	};
	nodeValidator$1.nodeValidator = nodeValidator;

	var static_node_validator = {};

	Object.defineProperty(static_node_validator, "__esModule", { value: true });
	static_node_validator.staticNodeValidator = void 0;
	const common_1$3 = common;
	const staticNodeValidator = (nodeData) => {
	    Object.keys(nodeData).forEach((key) => {
	        if (!common_1$3.staticNodeAttributeKeys.includes(key)) {
	            throw new common_1$3.ValidationError("Static node does not allow " + key);
	        }
	    });
	    return true;
	};
	static_node_validator.staticNodeValidator = staticNodeValidator;

	var computed_node_validator = {};

	Object.defineProperty(computed_node_validator, "__esModule", { value: true });
	computed_node_validator.computedNodeValidator = void 0;
	const common_1$2 = common;
	const computedNodeValidator = (nodeData) => {
	    Object.keys(nodeData).forEach((key) => {
	        if (!common_1$2.computedNodeAttributeKeys.includes(key)) {
	            throw new common_1$2.ValidationError("Computed node does not allow " + key);
	        }
	    });
	    return true;
	};
	computed_node_validator.computedNodeValidator = computedNodeValidator;

	var relation_validator = {};

	Object.defineProperty(relation_validator, "__esModule", { value: true });
	relation_validator.relationValidator = void 0;
	const utils_1$2 = utils;
	const common_1$1 = common;
	const relationValidator = (data, staticNodeIds, computedNodeIds) => {
	    const nodeIds = new Set(Object.keys(data.nodes));
	    const pendings = {};
	    const waitlist = {};
	    // validate input relation and set pendings and wait list
	    computedNodeIds.forEach((computedNodeId) => {
	        const nodeData = data.nodes[computedNodeId];
	        pendings[computedNodeId] = new Set();
	        if ("inputs" in nodeData && nodeData && nodeData.inputs) {
	            nodeData.inputs.forEach((inputNodeId) => {
	                const sourceNodeId = (0, utils_1$2.parseNodeName)(inputNodeId, data.version ?? 0.02).nodeId;
	                if (sourceNodeId) {
	                    if (!nodeIds.has(sourceNodeId)) {
	                        throw new common_1$1.ValidationError(`Inputs not match: NodeId ${computedNodeId}, Inputs: ${sourceNodeId}`);
	                    }
	                    waitlist[sourceNodeId] === undefined && (waitlist[sourceNodeId] = new Set());
	                    pendings[computedNodeId].add(sourceNodeId);
	                    waitlist[sourceNodeId].add(computedNodeId);
	                }
	            });
	        }
	    });
	    // TODO. validate update
	    staticNodeIds.forEach((staticNodeId) => {
	        const nodeData = data.nodes[staticNodeId];
	        if ("value" in nodeData && nodeData.update) {
	            const update = nodeData.update;
	            const updateNodeId = (0, utils_1$2.parseNodeName)(update, data.version ?? 0.02).nodeId;
	            if (!updateNodeId) {
	                throw new common_1$1.ValidationError("Update it a literal");
	            }
	            if (!nodeIds.has(updateNodeId)) {
	                throw new common_1$1.ValidationError(`Update not match: NodeId ${staticNodeId}, update: ${update}`);
	            }
	        }
	    });
	    const cycle = (possibles) => {
	        possibles.forEach((possobleNodeId) => {
	            (waitlist[possobleNodeId] || []).forEach((waitingNodeId) => {
	                pendings[waitingNodeId].delete(possobleNodeId);
	            });
	        });
	        const running = [];
	        Object.keys(pendings).forEach((pendingNodeId) => {
	            if (pendings[pendingNodeId].size === 0) {
	                running.push(pendingNodeId);
	                delete pendings[pendingNodeId];
	            }
	        });
	        return running;
	    };
	    let runningQueue = cycle(staticNodeIds);
	    if (runningQueue.length === 0) {
	        throw new common_1$1.ValidationError("No Initial Runnning Node");
	    }
	    do {
	        runningQueue = cycle(runningQueue);
	    } while (runningQueue.length > 0);
	    if (Object.keys(pendings).length > 0) {
	        throw new common_1$1.ValidationError("Some nodes are not executed: " + Object.keys(pendings).join(", "));
	    }
	};
	relation_validator.relationValidator = relationValidator;

	var agent_validator = {};

	Object.defineProperty(agent_validator, "__esModule", { value: true });
	agent_validator.agentValidator = void 0;
	const common_1 = common;
	const agentValidator = (graphAgentIds, agentIds) => {
	    graphAgentIds.forEach((agentId) => {
	        if (!agentIds.has(agentId)) {
	            throw new common_1.ValidationError("Invalid Agent : " + agentId + " is not in AgentFunctionInfoDictionary.");
	        }
	    });
	    return true;
	};
	agent_validator.agentValidator = agentValidator;

	Object.defineProperty(validator, "__esModule", { value: true });
	validator.validateGraphData = void 0;
	const graph_data_validator_1 = graph_data_validator;
	const nodeValidator_1 = nodeValidator$1;
	const static_node_validator_1 = static_node_validator;
	const computed_node_validator_1 = computed_node_validator;
	const relation_validator_1 = relation_validator;
	const agent_validator_1 = agent_validator;
	const validateGraphData = (data, agentIds) => {
	    (0, graph_data_validator_1.graphNodesValidator)(data);
	    (0, graph_data_validator_1.graphDataValidator)(data);
	    const computedNodeIds = [];
	    const staticNodeIds = [];
	    const graphAgentIds = new Set();
	    Object.keys(data.nodes).forEach((nodeId) => {
	        const node = data.nodes[nodeId];
	        const isStaticNode = "value" in node;
	        (0, nodeValidator_1.nodeValidator)(node);
	        const agentId = isStaticNode ? "" : node.agent;
	        isStaticNode && (0, static_node_validator_1.staticNodeValidator)(node) && staticNodeIds.push(nodeId);
	        !isStaticNode && (0, computed_node_validator_1.computedNodeValidator)(node) && computedNodeIds.push(nodeId) && typeof agentId === "string" && graphAgentIds.add(agentId);
	    });
	    (0, agent_validator_1.agentValidator)(graphAgentIds, new Set(agentIds));
	    (0, relation_validator_1.relationValidator)(data, staticNodeIds, computedNodeIds);
	    return true;
	};
	validator.validateGraphData = validateGraphData;

	var task_manager = {};

	Object.defineProperty(task_manager, "__esModule", { value: true });
	task_manager.TaskManager = void 0;
	const utils_1$1 = utils;
	// TaskManage object controls the concurrency of ComputedNode execution.
	//
	// NOTE: A TaskManager instance will be shared between parent graph and its children
	// when nested agents are involved.
	class TaskManager {
	    constructor(concurrency) {
	        this.taskQueue = [];
	        this.runningNodes = new Set();
	        this.concurrency = concurrency;
	    }
	    // This internal method dequeus a task from the task queue
	    // and call the associated callback method, if the number of
	    // running task is lower than the spcified limit.
	    dequeueTaskIfPossible() {
	        if (this.runningNodes.size < this.concurrency) {
	            const task = this.taskQueue.shift();
	            if (task) {
	                this.runningNodes.add(task.node);
	                task.callback(task.node);
	            }
	        }
	    }
	    // Node will call this method to put itself in the execution queue.
	    // We call the associated callback function when it is dequeued.
	    addTask(node, graphId, callback) {
	        // Finder tasks in the queue, which has either the same or higher priority.
	        const count = this.taskQueue.filter((task) => {
	            return task.node.priority >= node.priority;
	        }).length;
	        (0, utils_1$1.assert)(count <= this.taskQueue.length, "TaskManager.addTask: Something is really wrong.");
	        this.taskQueue.splice(count, 0, { node, graphId, callback });
	        this.dequeueTaskIfPossible();
	    }
	    isRunning(graphId) {
	        const count = [...this.runningNodes].filter((node) => {
	            return node.graphId == graphId;
	        }).length;
	        return count > 0 || Array.from(this.taskQueue).filter((data) => data.graphId === graphId).length > 0;
	    }
	    // Node MUST call this method once the execution of agent function is completed
	    // either successfully or not.
	    onComplete(node) {
	        (0, utils_1$1.assert)(this.runningNodes.has(node), `TaskManager.onComplete node(${node.nodeId}) is not in list`);
	        this.runningNodes.delete(node);
	        this.dequeueTaskIfPossible();
	    }
	    // Node will call this method before it hands the task manager from the graph
	    // to a nested agent. We need to make it sure that there is enough room to run
	    // computed nodes inside the nested graph to avoid a deadlock.
	    prepareForNesting() {
	        this.concurrency++;
	    }
	    restoreAfterNesting() {
	        this.concurrency--;
	    }
	    getStatus(verbose = false) {
	        const runningNodes = Array.from(this.runningNodes).map((node) => node.nodeId);
	        const queuedNodes = this.taskQueue.map((task) => task.node.nodeId);
	        const nodes = verbose ? { runningNodes, queuedNodes } : {};
	        return {
	            concurrency: this.concurrency,
	            queue: this.taskQueue.length,
	            running: this.runningNodes.size,
	            ...nodes,
	        };
	    }
	}
	task_manager.TaskManager = TaskManager;

	Object.defineProperty(graphai, "__esModule", { value: true });
	graphai.GraphAI = void 0;
	const node_1 = node;
	const utils_1 = utils;
	const validator_1 = validator;
	const task_manager_1 = task_manager;
	const defaultConcurrency = 8;
	const latestVersion = 0.3;
	class GraphAI {
	    // This method is called when either the GraphAI obect was created,
	    // or we are about to start n-th iteration (n>2).
	    createNodes(data) {
	        const nodes = Object.keys(data.nodes).reduce((_nodes, nodeId) => {
	            const nodeData = data.nodes[nodeId];
	            if ("value" in nodeData) {
	                _nodes[nodeId] = new node_1.StaticNode(nodeId, nodeData, this);
	            }
	            else if ("agent" in nodeData) {
	                _nodes[nodeId] = new node_1.ComputedNode(this.graphId, nodeId, nodeData, this);
	            }
	            else {
	                throw new Error("Unknown node type (neither value nor agent): " + nodeId);
	            }
	            return _nodes;
	        }, {});
	        // Generate the waitlist for each node.
	        Object.keys(nodes).forEach((nodeId) => {
	            const node = nodes[nodeId];
	            if (node.isComputedNode) {
	                node.pendings.forEach((pending) => {
	                    if (nodes[pending]) {
	                        nodes[pending].waitlist.add(nodeId); // previousNode
	                    }
	                    else {
	                        throw new Error(`createNode: invalid input ${pending} for node, ${nodeId}`);
	                    }
	                });
	            }
	        });
	        return nodes;
	    }
	    getValueFromResults(source, results) {
	        return (0, utils_1.getDataFromSource)(source.nodeId ? results[source.nodeId] : undefined, source);
	    }
	    // for static
	    initializeNodes(previousResults) {
	        // If the result property is specified, inject it.
	        // If the previousResults exists (indicating we are in a loop),
	        // process the update property (nodeId or nodeId.propId).
	        Object.keys(this.data.nodes).forEach((nodeId) => {
	            const node = this.nodes[nodeId];
	            if (node?.isStaticNode) {
	                const value = node?.value;
	                if (value) {
	                    this.injectValue(nodeId, value, nodeId);
	                }
	                const update = node?.update;
	                if (update && previousResults) {
	                    const result = this.getValueFromResults(update, previousResults);
	                    this.injectValue(nodeId, result, update.nodeId);
	                }
	            }
	        });
	    }
	    constructor(data, agentFunctionInfoDictionary, options = {
	        taskManager: undefined,
	        agentFilters: [],
	        bypassAgentIds: [],
	    }) {
	        this.logs = [];
	        this.onLogCallback = (__log, __isUpdate) => { };
	        this.repeatCount = 0;
	        if (!data.version && !options.taskManager) {
	            console.warn("------------ missing version number");
	        }
	        this.version = data.version ?? latestVersion;
	        if (this.version < latestVersion) {
	            console.warn(`------------ upgrade to ${latestVersion}!`);
	        }
	        this.retryLimit = data.retry; // optional
	        this.graphId = URL.createObjectURL(new Blob()).slice(-36);
	        this.data = data;
	        this.agentFunctionInfoDictionary = agentFunctionInfoDictionary;
	        this.taskManager = options.taskManager ?? new task_manager_1.TaskManager(data.concurrency ?? defaultConcurrency);
	        this.agentFilters = options.agentFilters ?? [];
	        this.bypassAgentIds = options.bypassAgentIds ?? [];
	        this.loop = data.loop;
	        this.verbose = data.verbose === true;
	        this.onComplete = () => {
	            throw new Error("SOMETHING IS WRONG: onComplete is called without run()");
	        };
	        (0, validator_1.validateGraphData)(data, [...Object.keys(agentFunctionInfoDictionary), ...this.bypassAgentIds]);
	        this.nodes = this.createNodes(data);
	        this.initializeNodes();
	    }
	    getAgentFunctionInfo(agentId) {
	        if (agentId && this.agentFunctionInfoDictionary[agentId]) {
	            return this.agentFunctionInfoDictionary[agentId];
	        }
	        if (agentId && this.bypassAgentIds.includes(agentId)) {
	            return {
	                agent: async () => {
	                    return null;
	                },
	            };
	        }
	        // We are not supposed to hit this error because the validator will catch it.
	        throw new Error("No agent: " + agentId);
	    }
	    asString() {
	        return Object.values(this.nodes)
	            .map((node) => node.asString())
	            .join("\n");
	    }
	    // Public API
	    results(all) {
	        return Object.keys(this.nodes)
	            .filter((nodeId) => all || this.nodes[nodeId].isResult)
	            .reduce((results, nodeId) => {
	            const node = this.nodes[nodeId];
	            if (node.result !== undefined) {
	                results[nodeId] = node.result;
	            }
	            return results;
	        }, {});
	    }
	    // Public API
	    errors() {
	        return Object.keys(this.nodes).reduce((errors, nodeId) => {
	            const node = this.nodes[nodeId];
	            if (node.isComputedNode) {
	                if (node.error !== undefined) {
	                    errors[nodeId] = node.error;
	                }
	            }
	            return errors;
	        }, {});
	    }
	    pushReadyNodesIntoQueue() {
	        // Nodes without pending data should run immediately.
	        Object.keys(this.nodes).forEach((nodeId) => {
	            const node = this.nodes[nodeId];
	            if (node.isComputedNode) {
	                this.pushQueueIfReady(node);
	            }
	        });
	    }
	    pushQueueIfReady(node) {
	        if (node.isReadyNode()) {
	            this.pushQueue(node);
	        }
	    }
	    pushQueueIfReadyAndRunning(node) {
	        if (this.isRunning()) {
	            this.pushQueueIfReady(node);
	        }
	    }
	    // for computed
	    pushQueue(node) {
	        node.beforeAddTask();
	        this.taskManager.addTask(node, this.graphId, (_node) => {
	            (0, utils_1.assert)(node.nodeId === _node.nodeId, "GraphAI.pushQueue node mismatch");
	            node.execute();
	        });
	    }
	    // Public API
	    async run(all = false) {
	        if (this.isRunning()) {
	            throw new Error("This GraphUI instance is already running");
	        }
	        this.pushReadyNodesIntoQueue();
	        if (!this.isRunning()) {
	            console.warn("-- nothing to execute");
	            return {};
	        }
	        return new Promise((resolve, reject) => {
	            this.onComplete = () => {
	                const errors = this.errors();
	                const nodeIds = Object.keys(errors);
	                if (nodeIds.length > 0) {
	                    reject(errors[nodeIds[0]]);
	                }
	                else {
	                    resolve(this.results(all));
	                }
	            };
	        });
	    }
	    // Public only for testing
	    isRunning() {
	        return this.taskManager.isRunning(this.graphId);
	    }
	    // callback from execute
	    onExecutionComplete(node) {
	        this.taskManager.onComplete(node);
	        if (this.isRunning() || this.processLoopIfNecessary()) {
	            return; // continue running
	        }
	        this.onComplete(); // Nothing to run. Finish it.
	    }
	    // Must be called only from onExecutionComplete righ after removeRunning
	    // Check if there is any running computed nodes.
	    // In case of no running computed note, start the another iteration if ncessary (loop)
	    processLoopIfNecessary() {
	        this.repeatCount++;
	        const loop = this.loop;
	        if (loop && (loop.count === undefined || this.repeatCount < loop.count)) {
	            const results = this.results(true); // results from previous loop
	            this.nodes = this.createNodes(this.data);
	            this.initializeNodes(results);
	            // Notice that we need to check the while condition *after* calling initializeNodes.
	            if (loop.while) {
	                const source = (0, utils_1.parseNodeName)(loop.while, this.version);
	                const value = this.getValueFromResults(source, this.results(true));
	                // NOTE: We treat an empty array as false.
	                if (!(0, utils_1.isLogicallyTrue)(value)) {
	                    return false; // while condition is not met
	                }
	            }
	            this.pushReadyNodesIntoQueue();
	            return true; // Indicating that we are going to continue.
	        }
	        return false;
	    }
	    setLoopLog(log) {
	        log.isLoop = !!this.loop;
	        log.repeatCount = this.repeatCount;
	    }
	    appendLog(log) {
	        this.logs.push(log);
	        this.onLogCallback(log, false);
	    }
	    updateLog(log) {
	        this.onLogCallback(log, true);
	    }
	    // Public API
	    transactionLogs() {
	        return this.logs;
	    }
	    // Public API
	    injectValue(nodeId, value, injectFrom) {
	        const node = this.nodes[nodeId];
	        if (node && node.isStaticNode) {
	            node.injectValue(value, injectFrom);
	        }
	        else {
	            throw new Error(`injectValue with Invalid nodeId, ${nodeId}`);
	        }
	    }
	    resultsOf(sources) {
	        return sources.map((source) => {
	            const { result } = source.nodeId ? this.nodes[source.nodeId] : { result: undefined };
	            return (0, utils_1.getDataFromSource)(result, source);
	        });
	    }
	}
	graphai.GraphAI = GraphAI;

	var runner = {};

	Object.defineProperty(runner, "__esModule", { value: true });
	runner.agentFilterRunnerBuilder = void 0;
	// for test and server.
	const agentFilterRunnerBuilder = (__agentFilters) => {
	    const agentFilters = __agentFilters;
	    const agentFilterRunner = (context, agent) => {
	        let index = 0;
	        const next = (context) => {
	            const agentFilter = agentFilters[index++];
	            if (agentFilter) {
	                return agentFilter.agent(context, next);
	            }
	            return agent(context);
	        };
	        return next(context);
	    };
	    return agentFilterRunner;
	};
	runner.agentFilterRunnerBuilder = agentFilterRunnerBuilder;

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ValidationError = exports.strIntentionalError = exports.defaultTestContext = exports.agentInfoWrapper = exports.defaultAgentInfo = exports.agentFilterRunnerBuilder = exports.NodeState = exports.GraphAI = void 0;
		var graphai_1 = graphai;
		Object.defineProperty(exports, "GraphAI", { enumerable: true, get: function () { return graphai_1.GraphAI; } });
		var type_1 = type;
		Object.defineProperty(exports, "NodeState", { enumerable: true, get: function () { return type_1.NodeState; } });
		var runner_1 = runner;
		Object.defineProperty(exports, "agentFilterRunnerBuilder", { enumerable: true, get: function () { return runner_1.agentFilterRunnerBuilder; } });
		var utils_1 = utils;
		Object.defineProperty(exports, "defaultAgentInfo", { enumerable: true, get: function () { return utils_1.defaultAgentInfo; } });
		Object.defineProperty(exports, "agentInfoWrapper", { enumerable: true, get: function () { return utils_1.agentInfoWrapper; } });
		Object.defineProperty(exports, "defaultTestContext", { enumerable: true, get: function () { return utils_1.defaultTestContext; } });
		Object.defineProperty(exports, "strIntentionalError", { enumerable: true, get: function () { return utils_1.strIntentionalError; } });
		var common_1 = common;
		Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return common_1.ValidationError; } }); 
	} (lib));

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.nestedAgent = exports.getNestedGraphData = void 0;
		const graphai_1 = lib;
		const utils_1 = utils;
		// This function allows us to use one of inputs as the graph data for this nested agent,
		// which is equivalent to "eval" of JavaScript.
		const getNestedGraphData = (graphData, inputs) => {
		    (0, utils_1.assert)(graphData !== undefined, "nestedAgent: graphData is required");
		    if (typeof graphData === "string") {
		        const regex = /^\$(\d+)$/;
		        const match = graphData.match(regex);
		        if (match) {
		            const index = parseInt(match[1], 10);
		            if (index < inputs.length) {
		                return inputs[index];
		            }
		        }
		        (0, utils_1.assert)(false, `getNestedGraphData: Invalid graphData string: ${graphData}`);
		    }
		    return graphData;
		};
		exports.getNestedGraphData = getNestedGraphData;
		const nestedAgent = async ({ params, inputs, agents, log, taskManager, graphData, agentFilters }) => {
		    if (taskManager) {
		        const status = taskManager.getStatus(false);
		        (0, utils_1.assert)(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
		    }
		    const nestedGraphData = (0, exports.getNestedGraphData)(graphData, inputs);
		    const namedInputs = params.namedInputs ?? inputs.map((__input, index) => `$${index}`);
		    namedInputs.forEach((nodeId, index) => {
		        if (nestedGraphData.nodes[nodeId] === undefined) {
		            // If the input node does not exist, automatically create a static node
		            nestedGraphData.nodes[nodeId] = { value: inputs[index] };
		        }
		        else {
		            // Otherwise, inject the proper data here (instead of calling injectTo method later)
		            nestedGraphData.nodes[nodeId]["value"] = inputs[index];
		        }
		    });
		    try {
		        const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, {
		            taskManager,
		            agentFilters,
		        });
		        const results = await graphAI.run(false);
		        log?.push(...graphAI.transactionLogs());
		        return results;
		    }
		    catch (error) {
		        if (error instanceof Error) {
		            return {
		                onError: {
		                    message: error.message,
		                    error,
		                },
		            };
		        }
		        throw error;
		    }
		};
		exports.nestedAgent = nestedAgent;
		const nestedAgentInfo = {
		    name: "nestedAgent",
		    agent: exports.nestedAgent,
		    mock: exports.nestedAgent,
		    samples: [],
		    description: "nested Agent",
		    category: ["graph"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = nestedAgentInfo; 
	} (nested_agent));

	var map_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.mapAgent = void 0;
		const graphai_1 = lib;
		const utils_1 = utils;
		const nested_agent_1 = nested_agent;
		const mapAgent = async ({ params, inputs, agents, log, taskManager, graphData, agentFilters }) => {
		    if (taskManager) {
		        const status = taskManager.getStatus();
		        (0, utils_1.assert)(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
		    }
		    const nestedGraphData = (0, nested_agent_1.getNestedGraphData)(graphData, inputs);
		    const input = (Array.isArray(inputs[0]) ? inputs[0] : inputs).map((item) => item);
		    if (params.limit && params.limit < input.length) {
		        input.length = params.limit; // trim
		    }
		    const namedInputs = params.namedInputs ??
		        inputs.map((__input, index) => {
		            return `$${index}`;
		        });
		    namedInputs.forEach((nodeId) => {
		        if (nestedGraphData.nodes[nodeId] === undefined) {
		            // If the input node does not exist, automatically create a static node
		            nestedGraphData.nodes[nodeId] = { value: {} };
		        }
		    });
		    try {
		        const graphs = input.map((data) => {
		            const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, {
		                taskManager,
		                agentFilters: agentFilters || [],
		            });
		            // Only the first input will be mapped
		            namedInputs.forEach((injectToNodeId, index) => {
		                graphAI.injectValue(injectToNodeId, index === 0 ? data : inputs[index], "__mapAgent_inputs__");
		            });
		            return graphAI;
		        });
		        const runs = graphs.map((graph) => {
		            return graph.run(false);
		        });
		        const results = await Promise.all(runs);
		        const nodeIds = Object.keys(results[0]);
		        // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
		        const compositeResult = nodeIds.reduce((tmp, nodeId) => {
		            tmp[nodeId] = results.map((result) => {
		                return result[nodeId];
		            });
		            return tmp;
		        }, {});
		        if (log) {
		            const logs = graphs.map((graph, index) => {
		                return graph.transactionLogs().map((log) => {
		                    log.mapIndex = index;
		                    return log;
		                });
		            });
		            log.push(...logs.flat());
		        }
		        return compositeResult;
		    }
		    catch (error) {
		        if (error instanceof Error) {
		            return {
		                onError: {
		                    message: error.message,
		                    error,
		                },
		            };
		        }
		        throw error;
		    }
		};
		exports.mapAgent = mapAgent;
		const mapAgentInfo = {
		    name: "mapAgent",
		    agent: exports.mapAgent,
		    mock: exports.mapAgent,
		    samples: [],
		    description: "Map Agent",
		    category: ["graph"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = mapAgentInfo; 
	} (map_agent));

	var worker_agent = {};

	var hasRequiredWorker_agent;

	function requireWorker_agent () {
		if (hasRequiredWorker_agent) return worker_agent;
		hasRequiredWorker_agent = 1;
		(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.workerAgent = void 0;
			const graphai_1 = lib;
			const worker_threads_1 = require$$1;
			const index_1 = requireLib();
			const utils_1 = utils;
			const vanillaAgents = {
			    totalAgent: index_1.totalAgent,
			    dataSumTemplateAgent: index_1.dataSumTemplateAgent,
			    propertyFilterAgent: index_1.propertyFilterAgent,
			    copyAgent: index_1.copyAgent,
			    pushAgent: index_1.pushAgent,
			    popAgent: index_1.popAgent,
			    shiftAgent: index_1.shiftAgent,
			    nestedAgent: index_1.nestedAgent,
			    mapAgent: index_1.mapAgent,
			    dotProductAgent: index_1.dotProductAgent,
			    sortByValuesAgent: index_1.sortByValuesAgent,
			    stringSplitterAgent: index_1.stringSplitterAgent,
			    stringTemplateAgent: index_1.stringTemplateAgent,
			    jsonParserAgent: index_1.jsonParserAgent,
			};
			if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
			    const port = worker_threads_1.parentPort;
			    port.on("message", async (data) => {
			        const { graphData } = data;
			        const graphAI = new graphai_1.GraphAI(graphData, vanillaAgents);
			        const result = await graphAI.run();
			        port.postMessage(result);
			    });
			}
			const workerAgent = async ({ inputs, params, /* agents, log, */ graphData }) => {
			    const namedInputs = params.namedInputs ?? inputs.map((__input, index) => `$${index}`);
			    (0, utils_1.assert)(!!graphData, "required");
			    (0, utils_1.assert)(typeof graphData === "object", "required");
			    namedInputs.forEach((nodeId, index) => {
			        if (graphData.nodes[nodeId] === undefined) {
			            // If the input node does not exist, automatically create a static node
			            graphData.nodes[nodeId] = { value: inputs[index] };
			        }
			        else {
			            // Otherwise, inject the proper data here (instead of calling injectTo method later)
			            graphData.nodes[nodeId]["value"] = inputs[index];
			        }
			    });
			    return new Promise((resolve, reject) => {
			        const worker = new worker_threads_1.Worker(__dirname + "/worker_agent");
			        worker.on("message", (result) => {
			            worker.terminate();
			            resolve(result);
			        });
			        worker.on("error", reject);
			        worker.on("exit", (code) => {
			            if (code !== 0)
			                reject(new Error(`Worker stopped with exit code ${code}`));
			        });
			        // copyAgent is required for test case
			        worker.postMessage({ graphData });
			    });
			};
			exports.workerAgent = workerAgent;
			const workerAgentInfo = {
			    name: "workerAgent",
			    agent: exports.workerAgent,
			    mock: exports.workerAgent,
			    samples: [
			        {
			            inputs: [],
			            params: {},
			            result: { message: "May the force be with you" },
			            graph: {
			                version: 0.3,
			                nodes: {
			                    source: {
			                        value: "May the force be with you",
			                    },
			                    message: {
			                        agent: "copyAgent",
			                        inputs: [":source"],
			                        isResult: true,
			                    },
			                },
			            },
			        },
			        {
			            inputs: ["May the force be with you"],
			            params: {},
			            result: { message: "May the force be with you" },
			            graph: {
			                version: 0.3,
			                nodes: {
			                    source: {
			                        value: "TypeScript compiler fails without this node for some reason.",
			                    },
			                    message: {
			                        agent: "copyAgent",
			                        inputs: [":$0"],
			                        isResult: true,
			                    },
			                },
			            },
			        },
			    ],
			    description: "Map Agent",
			    category: ["graph"],
			    author: "Receptron team",
			    repository: "https://github.com/receptron/graphai",
			    license: "MIT",
			};
			exports.default = workerAgentInfo; 
		} (worker_agent));
		return worker_agent;
	}

	var hasRequiredVanilla;

	function requireVanilla () {
		if (hasRequiredVanilla) return vanilla$1;
		hasRequiredVanilla = 1;
		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(vanilla$1, "__esModule", { value: true });
		vanilla$1.workerAgent = vanilla$1.mapAgent = vanilla$1.nestedAgent = void 0;
		const nested_agent_1 = __importDefault(nested_agent);
		vanilla$1.nestedAgent = nested_agent_1.default;
		const map_agent_1 = __importDefault(map_agent);
		vanilla$1.mapAgent = map_agent_1.default;
		const worker_agent_1 = __importDefault(requireWorker_agent());
		vanilla$1.workerAgent = worker_agent_1.default;
		return vanilla$1;
	}

	var vanilla = {};

	var total_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.totalAgent = void 0;
		const totalAgent = async ({ inputs }) => {
		    return inputs.reduce((result, input) => {
		        const inputArray = Array.isArray(input) ? input : [input];
		        inputArray.forEach((innerInput) => {
		            Object.keys(innerInput).forEach((key) => {
		                const value = innerInput[key];
		                if (result[key]) {
		                    result[key] += value;
		                }
		                else {
		                    result[key] = value;
		                }
		            });
		        });
		        return result;
		    }, {});
		};
		exports.totalAgent = totalAgent;
		// for test and document
		const sampleInputs = [{ a: 1 }, { a: 2 }, { a: 3 }];
		const sampleParams = {};
		const sampleResult = { a: 6 };
		const sample2Inputs = [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]];
		const sample2Params = {};
		const sample2Result = { a: 6, b: -4, c: 10, d: -10 };
		//
		const totalAgentInfo = {
		    name: "totalAgent",
		    agent: exports.totalAgent,
		    mock: exports.totalAgent,
		    samples: [
		        {
		            inputs: sampleInputs,
		            params: sampleParams,
		            result: sampleResult,
		        },
		        {
		            inputs: sample2Inputs,
		            params: sample2Params,
		            result: sample2Result,
		        },
		        {
		            inputs: [{ a: 1 }],
		            params: {},
		            result: { a: 1 },
		        },
		        {
		            inputs: [{ a: 1 }, { a: 2 }],
		            params: {},
		            result: { a: 3 },
		        },
		        {
		            inputs: [{ a: 1 }, { a: 2 }, { a: 3 }],
		            params: {},
		            result: { a: 6 },
		        },
		        {
		            inputs: [
		                { a: 1, b: 1 },
		                { a: 2, b: 2 },
		                { a: 3, b: 0 },
		            ],
		            params: {},
		            result: { a: 6, b: 3 },
		        },
		        {
		            inputs: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }],
		            params: {},
		            result: { a: 6, b: 2 },
		        },
		    ],
		    description: "Returns the sum of input values",
		    category: ["data"],
		    author: "Satoshi Nakajima",
		    repository: "https://github.com/snakajima/graphai",
		    license: "MIT",
		};
		exports.default = totalAgentInfo; 
	} (total_agent));

	var data_sum_template_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.dataSumTemplateAgent = void 0;
		const dataSumTemplateAgent = async ({ inputs }) => {
		    return inputs.reduce((tmp, input) => {
		        return tmp + input;
		    }, 0);
		};
		exports.dataSumTemplateAgent = dataSumTemplateAgent;
		// for test and document
		const sampleInputs = [1, 2, 3];
		const sampleParams = {};
		const sampleResult = 6;
		const dataSumTemplateAgentInfo = {
		    name: "dataSumTemplateAgent",
		    agent: exports.dataSumTemplateAgent,
		    mock: exports.dataSumTemplateAgent,
		    samples: [
		        {
		            inputs: sampleInputs,
		            params: sampleParams,
		            result: sampleResult,
		        },
		        {
		            inputs: [1],
		            params: {},
		            result: 1,
		        },
		        {
		            inputs: [1, 2],
		            params: {},
		            result: 3,
		        },
		        {
		            inputs: [1, 2, 3],
		            params: {},
		            result: 6,
		        },
		    ],
		    description: "Returns the sum of input values",
		    category: ["data"],
		    author: "Satoshi Nakajima",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = dataSumTemplateAgentInfo; 
	} (data_sum_template_agent));

	var property_filter_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.propertyFilterAgent = void 0;
		const applyFilter = (input, index, inputs, include, exclude, alter, inject, swap, inspect) => {
		    const propIds = include ? include : Object.keys(input);
		    const excludeSet = new Set(exclude ?? []);
		    const result = propIds.reduce((tmp, propId) => {
		        if (!excludeSet.has(propId)) {
		            const mapping = alter && alter[propId];
		            if (mapping && mapping[input[propId]]) {
		                tmp[propId] = mapping[input[propId]];
		            }
		            else {
		                tmp[propId] = input[propId];
		            }
		        }
		        return tmp;
		    }, {});
		    if (inject) {
		        inject.forEach((item) => {
		            if (item.index === undefined || item.index === index) {
		                result[item.propId] = inputs[item.from];
		            }
		        });
		    }
		    if (inspect) {
		        inspect.forEach((item) => {
		            const value = inputs[item.from ?? 1]; // default is inputs[1]
		            if (item.equal) {
		                result[item.propId] = item.equal === value;
		            }
		            else if (item.notEqual) {
		                result[item.propId] = item.notEqual !== value;
		            }
		        });
		    }
		    if (swap) {
		        Object.keys(swap).forEach((key) => {
		            const tmp = result[key];
		            result[key] = result[swap[key]];
		            result[swap[key]] = tmp;
		        });
		    }
		    return result;
		};
		const propertyFilterAgent = async ({ inputs, params }) => {
		    const [input] = inputs;
		    const { include, exclude, alter, inject, swap, inspect } = params;
		    if (Array.isArray(input)) {
		        return input.map((item, index) => applyFilter(item, index, inputs, include, exclude, alter, inject, swap, inspect));
		    }
		    return applyFilter(input, 0, inputs, include, exclude, alter, inject, swap, inspect);
		};
		exports.propertyFilterAgent = propertyFilterAgent;
		const testInputs = [
		    [
		        { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
		        { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
		    ],
		    "Tesla Motors",
		];
		const propertyFilterAgentInfo = {
		    name: "propertyFilterAgent",
		    agent: exports.propertyFilterAgent,
		    mock: exports.propertyFilterAgent,
		    samples: [
		        {
		            inputs: [testInputs[0][0]],
		            params: { include: ["color", "model"] },
		            result: { color: "red", model: "Model 3" },
		        },
		        {
		            inputs: testInputs,
		            params: { include: ["color", "model"] },
		            result: [
		                { color: "red", model: "Model 3" },
		                { color: "blue", model: "Model Y" },
		            ],
		        },
		        {
		            inputs: testInputs,
		            params: { exclude: ["color", "model"] },
		            result: [
		                { type: "EV", maker: "Tesla", range: 300 },
		                { type: "EV", maker: "Tesla", range: 400 },
		            ],
		        },
		        {
		            inputs: testInputs,
		            params: { alter: { color: { red: "blue", blue: "red" } } },
		            result: [
		                {
		                    color: "blue",
		                    model: "Model 3",
		                    type: "EV",
		                    maker: "Tesla",
		                    range: 300,
		                },
		                {
		                    color: "red",
		                    model: "Model Y",
		                    type: "EV",
		                    maker: "Tesla",
		                    range: 400,
		                },
		            ],
		        },
		        {
		            inputs: testInputs,
		            params: { inject: [{ propId: "maker", from: 1 }] },
		            result: [
		                {
		                    color: "red",
		                    model: "Model 3",
		                    type: "EV",
		                    maker: "Tesla Motors",
		                    range: 300,
		                },
		                {
		                    color: "blue",
		                    model: "Model Y",
		                    type: "EV",
		                    maker: "Tesla Motors",
		                    range: 400,
		                },
		            ],
		        },
		        {
		            inputs: testInputs,
		            params: { inject: [{ propId: "maker", from: 1, index: 0 }] },
		            result: [
		                {
		                    color: "red",
		                    model: "Model 3",
		                    type: "EV",
		                    maker: "Tesla Motors",
		                    range: 300,
		                },
		                {
		                    color: "blue",
		                    model: "Model Y",
		                    type: "EV",
		                    maker: "Tesla",
		                    range: 400,
		                },
		            ],
		        },
		        {
		            inputs: testInputs,
		            params: { swap: { maker: "model" } },
		            result: [
		                {
		                    color: "red",
		                    model: "Tesla",
		                    type: "EV",
		                    maker: "Model 3",
		                    range: 300,
		                },
		                {
		                    color: "blue",
		                    model: "Tesla",
		                    type: "EV",
		                    maker: "Model Y",
		                    range: 400,
		                },
		            ],
		        },
		        {
		            inputs: testInputs,
		            params: {
		                inspect: [
		                    { propId: "isTesla", equal: "Tesla Motors" }, // from: 1 is implied
		                    { propId: "isGM", notEqual: "Tesla Motors", from: 1 },
		                ],
		            },
		            result: [
		                {
		                    color: "red",
		                    model: "Model 3",
		                    type: "EV",
		                    maker: "Tesla",
		                    range: 300,
		                    isTesla: true,
		                    isGM: false,
		                },
		                {
		                    color: "blue",
		                    model: "Model Y",
		                    type: "EV",
		                    maker: "Tesla",
		                    range: 400,
		                    isTesla: true,
		                    isGM: false,
		                },
		            ],
		        },
		    ],
		    description: "Filter properties based on property name either with 'include' or 'exclude'",
		    category: ["data"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = propertyFilterAgentInfo; 
	} (property_filter_agent));

	var copy_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.copyAgent = void 0;
		const copyAgent = async ({ inputs }) => {
		    const [input] = inputs;
		    return input;
		};
		exports.copyAgent = copyAgent;
		const copyAgentInfo = {
		    name: "copyAgent",
		    agent: exports.copyAgent,
		    mock: exports.copyAgent,
		    samples: [
		        {
		            inputs: [{ color: "red", model: "Model 3" }],
		            params: {},
		            result: { color: "red", model: "Model 3" },
		        },
		        {
		            inputs: ["Hello World"],
		            params: {},
		            result: "Hello World",
		        },
		    ],
		    description: "Returns inputs[0]",
		    category: ["data"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = copyAgentInfo; 
	} (copy_agent));

	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(vanilla, "__esModule", { value: true });
	vanilla.copyAgent = vanilla.propertyFilterAgent = vanilla.dataSumTemplateAgent = vanilla.totalAgent = void 0;
	const total_agent_1 = __importDefault(total_agent);
	vanilla.totalAgent = total_agent_1.default;
	const data_sum_template_agent_1 = __importDefault(data_sum_template_agent);
	vanilla.dataSumTemplateAgent = data_sum_template_agent_1.default;
	const property_filter_agent_1 = __importDefault(property_filter_agent);
	vanilla.propertyFilterAgent = property_filter_agent_1.default;
	const copy_agent_1 = __importDefault(copy_agent);
	vanilla.copyAgent = copy_agent_1.default;

	var embedding_agent = {};

	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.stringEmbeddingsAgent = void 0;
		const defaultEmbeddingModel = "text-embedding-3-small";
		const OpenAI_embedding_API = "https://api.openai.com/v1/embeddings";
		// This agent retrieves embedding vectors for an array of strings using OpenAI's API
		//
		// Parameters:
		//   model: Specifies the model (default is "text-embedding-3-small")
		// Inputs:
		//   inputs[0]: Array<string>
		// Result:
		//   contents: Array<Array<number>>
		//
		const stringEmbeddingsAgent = async ({ params, inputs }) => {
		    const input = inputs[0];
		    const sources = Array.isArray(input) ? input : [input];
		    const apiKey = process.env.OPENAI_API_KEY;
		    if (!apiKey) {
		        throw new Error("OPENAI_API_KEY key is not set in environment variables.");
		    }
		    const headers = {
		        "Content-Type": "application/json",
		        Authorization: `Bearer ${apiKey}`,
		    };
		    const response = await fetch(OpenAI_embedding_API, {
		        method: "POST",
		        headers: headers,
		        body: JSON.stringify({
		            input: sources,
		            model: params?.model ?? defaultEmbeddingModel,
		        }),
		    });
		    const jsonResponse = await response.json();
		    if (!response.ok) {
		        throw new Error(`HTTP error! status: ${response.status}`);
		    }
		    const embeddings = jsonResponse.data.map((object) => {
		        return object.embedding;
		    });
		    return embeddings;
		};
		exports.stringEmbeddingsAgent = stringEmbeddingsAgent;
		const stringEmbeddingsAgentInfo = {
		    name: "stringEmbeddingsAgent",
		    agent: exports.stringEmbeddingsAgent,
		    mock: exports.stringEmbeddingsAgent,
		    samples: [],
		    description: "Embeddings Agent",
		    category: ["embedding"],
		    author: "Receptron team",
		    repository: "https://github.com/receptron/graphai",
		    license: "MIT",
		};
		exports.default = stringEmbeddingsAgentInfo; 
	} (embedding_agent));

	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib$1;
		hasRequiredLib = 1;
		(function (exports) {
			// This file adds agents that runs in pure JavaScript without any external npm modules.
			var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
			    return (mod && mod.__esModule) ? mod : { "default": mod };
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.stringEmbeddingsAgent = void 0;
			// Please refrain from adding agents that require npm. Those should be added to the index.ts.
			__exportStar(vanilla$5, exports);
			__exportStar(vanilla$4, exports);
			__exportStar(vanilla$3, exports);
			__exportStar(vanilla$2, exports);
			__exportStar(requireVanilla(), exports);
			__exportStar(vanilla, exports);
			const embedding_agent_1 = __importDefault(embedding_agent);
			exports.stringEmbeddingsAgent = embedding_agent_1.default; 
		} (lib$1));
		return lib$1;
	}

	var libExports = requireLib();
	var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

	return index;

}));
