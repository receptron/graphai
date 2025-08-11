import { assert, isObject, graphDataLatestVersion, GraphAI, sleep } from 'graphai';

// This agent strip one long string into chunks using following parameters
//
//  chunkSize: number; // default is 2048
//  overlap: number;   // default is 1/8th of chunkSize.
//
// see example
//  tests/agents/test_string_agent.ts
//
const defaultChunkSize = 2048;
const stringSplitterAgent = async ({ params, namedInputs }) => {
    assert(!!namedInputs, "stringSplitterAgent: namedInputs is UNDEFINED!");
    const source = namedInputs.text;
    const chunkSize = params.chunkSize ?? defaultChunkSize;
    const overlap = params.overlap ?? Math.floor(chunkSize / 8);
    const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
    const contents = new Array(count).fill(undefined).map((_, i) => {
        const startIndex = i * (chunkSize - overlap);
        return source.substring(startIndex, startIndex + chunkSize);
    });
    return { contents, count, chunkSize, overlap };
};
// for test and document
const sampleInput = {
    text: "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do.",
};
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
    agent: stringSplitterAgent,
    mock: stringSplitterAgent,
    inputs: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text to be chuncked",
            },
        },
        required: ["text"],
    },
    output: {
        type: "object",
        properties: {
            contents: {
                type: "array",
                description: "the array of text chunks",
            },
            count: {
                type: "number",
                description: "the number of chunks",
            },
            chunkSize: {
                type: "number",
                description: "the chunk size",
            },
            overlap: {
                type: "number",
                description: "the overlap size",
            },
        },
    },
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
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_splitter_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const processTemplate = (template, match, input) => {
    if (typeof template === "string") {
        if (template === match) {
            return input;
        }
        return template.replace(match, input);
    }
    else if (Array.isArray(template)) {
        return template.map((item) => processTemplate(item, match, input));
    }
    if (isObject(template)) {
        return Object.keys(template).reduce((tmp, key) => {
            tmp[key] = processTemplate(template[key], match, input);
            return tmp;
        }, {});
    }
    return template;
};
const stringTemplateAgent = async ({ params, namedInputs }) => {
    if (params.template === undefined) {
        if (namedInputs.text) {
            return namedInputs.text;
        }
        console.warn("warning: stringTemplateAgent no template");
    }
    return Object.keys(namedInputs).reduce((template, key) => {
        return processTemplate(template, "${" + key + "}", namedInputs[key]);
    }, params.template);
};
const sampleNamedInput = { message1: "hello", message2: "test" };
// for test and document
const stringTemplateAgentInfo = {
    name: "stringTemplateAgent",
    agent: stringTemplateAgent,
    mock: stringTemplateAgent,
    inputs: {
        type: "object",
        description: "Key-value pairs where each key corresponds to a variable used in the template (e.g., ${key}).",
        additionalProperties: {
            type: ["string", "number", "boolean", "object", "array", "null"],
            description: "Any value to be substituted into the template. Objects and arrays are injected directly if the entire field is a placeholder.",
        },
    },
    params: {
        type: "object",
        description: "The template to apply substitutions to. Supports strings, arrays, and deeply nested object structures with placeholder strings.",
        properties: {
            template: {
                description: "The template structure where placeholders like ${key} will be replaced with values from 'inputs'.",
                anyOf: [
                    { type: "string" },
                    {
                        type: "array",
                        items: {
                            anyOf: [
                                { type: "string" },
                                {
                                    type: "object",
                                    additionalProperties: {
                                        anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: "object",
                        additionalProperties: {
                            anyOf: [
                                { type: "string" },
                                {
                                    type: "array",
                                    items: { type: "string" },
                                },
                                {
                                    type: "object",
                                    additionalProperties: true,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        required: ["template"],
        additionalProperties: false,
    },
    output: {
        description: "The result after placeholder substitution, matching the structure and type of the original template.",
        anyOf: [
            { type: "string" },
            {
                type: "array",
                items: {
                    anyOf: [
                        { type: "string" },
                        {
                            type: "object",
                            additionalProperties: true,
                        },
                    ],
                },
            },
            {
                type: "object",
                additionalProperties: true,
            },
        ],
    },
    samples: [
        // named
        {
            inputs: sampleNamedInput,
            params: { template: "${message1}: ${message2}" },
            result: "hello: test",
        },
        {
            inputs: sampleNamedInput,
            params: { template: ["${message1}: ${message2}", "${message2}: ${message1}"] },
            result: ["hello: test", "test: hello"],
        },
        {
            inputs: sampleNamedInput,
            params: { template: { apple: "${message1}", lemon: "${message2}" } },
            result: { apple: "hello", lemon: "test" },
        },
        {
            inputs: sampleNamedInput,
            params: { template: [{ apple: "${message1}", lemon: "${message2}" }] },
            result: [{ apple: "hello", lemon: "test" }],
        },
        {
            inputs: sampleNamedInput,
            params: { template: { apple: "${message1}", lemon: ["${message2}"] } },
            result: { apple: "hello", lemon: ["test"] },
        },
        // graphData
        {
            inputs: { agent: "openAiAgent", row: "hello world", params: { text: "message" } },
            params: {
                template: {
                    version: 0.5,
                    nodes: {
                        ai: {
                            agent: "${agent}",
                            isResult: true,
                            params: "${params}",
                            inputs: { prompt: "${row}" },
                        },
                    },
                },
            },
            result: {
                nodes: {
                    ai: {
                        agent: "openAiAgent",
                        inputs: {
                            prompt: "hello world",
                        },
                        isResult: true,
                        params: { text: "message" },
                    },
                },
                version: 0.5,
            },
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_template_agent.ts",
    package: "@graphai/vanilla",
    cacheType: "pureAgent",
    license: "MIT",
};

const jsonParserAgent = async ({ namedInputs }) => {
    const { text, data } = namedInputs;
    if (data) {
        return {
            text: JSON.stringify(data, null, 2),
        };
    }
    const match = ("\n" + text).match(/\n```[a-zA-Z]*([\s\S]*?)\n```/);
    if (match) {
        return {
            data: JSON.parse(match[1]),
        };
    }
    return {
        data: JSON.parse(text ?? ""),
    };
};
const sample_object = { apple: "red", lemon: "yellow" };
const json_str = JSON.stringify(sample_object);
const md_json1 = ["```", json_str, "```"].join("\n");
const md_json2 = ["```json", json_str, "```"].join("\n");
const md_json3 = ["```JSON", json_str, "```"].join("\n");
const jsonParserAgentInfo = {
    name: "jsonParserAgent",
    agent: jsonParserAgent,
    mock: jsonParserAgent,
    inputs: {
        type: "object",
        description: "The input object containing either a JSON string in 'text' or a raw JavaScript object in 'data'. One of them is required.",
        properties: {
            text: {
                type: "string",
                description: "A JSON string, possibly embedded in a Markdown code block. If provided, it will be parsed into a data object.",
            },
            data: {
                anyOf: [{ type: "object" }, { type: "array" }, { type: "string" }, { type: "number" }],
                description: "Raw data to be converted into a formatted JSON string in the 'text' output.",
            },
        },
        required: [],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "No parameters are required for this agent.",
        properties: {},
        additionalProperties: false,
    },
    output: {
        type: "object",
        description: "Returns either a parsed data object (from 'text') or a formatted JSON string (from 'data').",
        properties: {
            text: {
                type: "string",
                description: "A pretty-printed JSON string generated from the 'data' input, if provided.",
            },
            data: {
                anyOf: [{ type: "object" }, { type: "array" }, { type: "string" }, { type: "number" }],
                description: "Parsed data object from the 'text' input, or the original 'data' if no parsing was required.",
            },
        },
        required: [],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: { data: sample_object },
            params: {},
            result: { text: JSON.stringify(sample_object, null, 2) },
        },
        {
            inputs: { text: JSON.stringify(sample_object, null, 2) },
            params: {},
            result: { data: sample_object },
        },
        {
            inputs: { text: md_json1 },
            params: {},
            result: { data: sample_object },
        },
        {
            inputs: { text: md_json2 },
            params: {},
            result: { data: sample_object },
        },
        {
            inputs: { text: md_json3 },
            params: {},
            result: { data: sample_object },
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/json_parser_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const stringCaseVariantsAgent = async ({ namedInputs, params }) => {
    const { suffix } = params;
    const normalizedArray = namedInputs.text
        .trim()
        .replace(/[\s-_]+/g, " ")
        .toLowerCase()
        .split(" ");
    if (suffix && normalizedArray[normalizedArray.length - 1] !== suffix) {
        normalizedArray.push(suffix);
    }
    const normalized = normalizedArray.join(" ");
    const lowerCamelCase = normalizedArray
        .map((word, index) => {
        if (index === 0)
            return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
        .join("");
    const snakeCase = normalized.replace(/\s+/g, "_");
    const kebabCase = normalized.replace(/\s+/g, "-");
    return { lowerCamelCase, snakeCase, kebabCase, normalized };
};
const stringCaseVariantsAgentInfo = {
    name: "stringCaseVariantsAgent",
    agent: stringCaseVariantsAgent,
    mock: stringCaseVariantsAgent,
    inputs: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "The input string to be transformed into various casing styles.",
            },
        },
        required: ["text"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            suffix: {
                type: "string",
                description: "An optional suffix to append to the input string before transforming cases.",
            },
        },
        additionalProperties: false,
    },
    output: {
        type: "object",
        properties: {
            kebabCase: {
                type: "string",
                description: "The input string converted to kebab-case (e.g., 'this-is-a-pen').",
            },
            snakeCase: {
                type: "string",
                description: "The input string converted to snake_case (e.g., 'this_is_a_pen').",
            },
            lowerCamelCase: {
                type: "string",
                description: "The input string converted to lowerCamelCase (e.g., 'thisIsAPen').",
            },
            normalized: {
                type: "string",
                description: "The original string, optionally appended with the suffix, in lowercase with normalized spacing.",
            },
        },
        required: ["kebabCase", "snakeCase", "lowerCamelCase", "normalized"],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: { text: "this is a pen" },
            params: {},
            result: {
                kebabCase: "this-is-a-pen",
                lowerCamelCase: "thisIsAPen",
                normalized: "this is a pen",
                snakeCase: "this_is_a_pen",
            },
        },
        {
            inputs: { text: "string case variants" },
            params: { suffix: "agent" },
            result: {
                kebabCase: "string-case-variants-agent",
                lowerCamelCase: "stringCaseVariantsAgent",
                normalized: "string case variants agent",
                snakeCase: "string_case_variants_agent",
            },
        },
    ],
    description: "Format String Cases agent",
    category: ["string"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_case_variants_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const nestedAgentGenerator = (graphData, options) => {
    return async (context) => {
        const { namedInputs, log, debugInfo, params, forNestedGraph } = context;
        assert(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");
        const { agents, graphOptions, onLogCallback, callbacks } = forNestedGraph;
        const { taskManager } = graphOptions;
        const supressError = params.supressError ?? false;
        if (taskManager) {
            const status = taskManager.getStatus(false);
            assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
        }
        assert(!!graphData, "nestedAgent: graph is required");
        const { nodes } = graphData;
        const newNodes = Object.keys(nodes).reduce((tmp, key) => {
            const node = nodes[key];
            if ("agent" in node) {
                tmp[key] = node;
            }
            else {
                const { value, update, isResult, console } = node;
                tmp[key] = { value, update, isResult, console };
            }
            return tmp;
        }, {});
        const nestedGraphData = { ...graphData, nodes: newNodes, version: graphDataLatestVersion }; // deep enough copy
        const nodeIds = Object.keys(namedInputs);
        if (nodeIds.length > 0) {
            nodeIds.forEach((nodeId) => {
                if (nestedGraphData.nodes[nodeId] === undefined) {
                    // If the input node does not exist, automatically create a static node
                    nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
                }
                else {
                    // Otherwise, inject the proper data here (instead of calling injectTo method later)
                    if (namedInputs[nodeId] !== undefined) {
                        nestedGraphData.nodes[nodeId]["value"] = namedInputs[nodeId];
                    }
                }
            });
        }
        try {
            if (nestedGraphData.version === undefined && debugInfo.version) {
                nestedGraphData.version = debugInfo.version;
            }
            const graphAI = new GraphAI(nestedGraphData, agents || {}, graphOptions);
            if (namedInputs.loopCount) {
                graphAI.setLoopCount(namedInputs.loopCount);
            }
            // for backward compatibility. Remove 'if' later
            if (onLogCallback) {
                graphAI.onLogCallback = onLogCallback;
            }
            if (callbacks) {
                graphAI.callbacks = callbacks;
            }
            debugInfo.subGraphs.set(graphAI.graphId, graphAI);
            const results = await graphAI.run(false);
            debugInfo.subGraphs.delete(graphAI.graphId);
            log?.push(...graphAI.transactionLogs());
            if (options && options.resultNodeId) {
                return results[options.resultNodeId];
            }
            return results;
        }
        catch (error) {
            if (error instanceof Error && supressError) {
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
};
const nestedAgent = async (context) => {
    const { forNestedGraph, params } = context;
    const { graphData } = forNestedGraph ?? { graphData: { nodes: {} } };
    assert(!!graphData, "No GraphData");
    return await nestedAgentGenerator(graphData, params)(context);
};
const nestedAgentInfo = {
    name: "nestedAgent",
    agent: nestedAgent,
    mock: nestedAgent,
    samples: [
        {
            inputs: {
                message: "hello",
            },
            params: {},
            result: {
                test: ["hello"],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "messages" },
                        inputs: { messages: [":message"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                message: "hello",
            },
            params: {
                resultNodeId: "test",
            },
            result: ["hello"],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "messages" },
                        inputs: { messages: [":message"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                loopCount: 5,
            },
            params: {
                resultNodeId: "test",
            },
            result: 4,
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "count" },
                        inputs: { count: "@loop" },
                        isResult: true,
                    },
                },
            },
        },
    ],
    description: "nested Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/nested_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const stringUpdateTextGraph = {
    version: graphDataLatestVersion,
    nodes: {
        newText: {
            value: "",
        },
        oldText: {
            value: "",
        },
        isNewText: {
            if: ":newText",
            agent: "copyAgent",
            inputs: {
                text: ":newText",
            },
        },
        isOldText: {
            unless: ":newText",
            agent: "copyAgent",
            inputs: {
                text: ":oldText",
            },
        },
        updatedText: {
            agent: "copyAgent",
            anyInput: true,
            inputs: {
                text: [":isNewText.text", ":isOldText.text"],
            },
        },
        resultText: {
            isResult: true,
            agent: "copyAgent",
            anyInput: true,
            inputs: {
                text: ":updatedText.text.$0",
            },
        },
    },
};
const stringUpdateTextAgent = nestedAgentGenerator(stringUpdateTextGraph, { resultNodeId: "resultText" });
const stringUpdateTextAgentInfo = {
    name: "stringUpdateTextAgent",
    agent: stringUpdateTextAgent,
    mock: stringUpdateTextAgent,
    inputs: {
        type: "object",
        properties: {
            newText: {
                type: "string",
                description: "The new text to use if provided and not empty.",
            },
            oldText: {
                type: "string",
                description: "The fallback text used if 'newText' is empty or not provided.",
            },
        },
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "No parameters are used in this agent.",
        properties: {},
        additionalProperties: false,
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "The resulting text. It is either the value of 'newText' if non-empty, otherwise 'oldText', or an empty string if both are missing.",
            },
        },
        required: ["text"],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: { newText: "new", oldText: "old" },
            params: {},
            result: { text: "new" },
        },
        {
            inputs: { newText: "", oldText: "old" },
            params: {},
            result: { text: "old" },
        },
        {
            inputs: {},
            params: {},
            result: { text: "" },
        },
        {
            inputs: { oldText: "old" },
            params: {},
            result: { text: "old" },
        },
    ],
    description: "",
    category: [],
    author: "",
    repository: "",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_update_text_agent.ts",
    package: "@graphai/vanilla",
    tools: [],
    license: "",
    hasGraphData: true,
};

const consoleAgent = async ({ namedInputs }) => {
    const { text } = namedInputs;
    console.info(text);
    return {
        text,
    };
};
const consoleAgentInfo = {
    name: "consoleAgent",
    agent: consoleAgent,
    mock: consoleAgent,
    inputs: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text",
            },
        },
    },
    samples: [
        {
            inputs: { text: "hello" },
            params: {},
            result: { text: "hello" },
        },
    ],
    description: "Just text to console.info",
    category: ["string"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/console_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const isNamedInputs = (namedInputs) => {
    return Object.keys(namedInputs || {}).length > 0;
};
const arrayValidate = (agentName, namedInputs, extra_message = "") => {
    assert(isNamedInputs(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
    assert(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
    assert(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
};

const pushAgent = async ({ namedInputs, params, }) => {
    const extra_message = " Set inputs: { array: :arrayNodeId, item: :itemNodeId }";
    arrayValidate("pushAgent", namedInputs, extra_message);
    const { item, items } = namedInputs;
    assert(item !== undefined || items !== undefined, "pushAgent: namedInputs.item and namedInputs.items are UNDEFINED!" + extra_message);
    assert(items === undefined || Array.isArray(items), "pushAgent: namedInputs.items is not array!");
    const array = namedInputs.array.map((item) => item); // shallow copy
    if (item !== undefined) {
        array.push(item);
    }
    if (items) {
        items.forEach((item) => {
            array.push(item);
        });
    }
    if (params.arrayKey) {
        return {
            [params.arrayKey]: array,
        };
    }
    return {
        array,
    };
};
const pushAgentInfo = {
    name: "pushAgent",
    agent: pushAgent,
    mock: pushAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to push an item to",
            },
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }, { type: "boolean" }],
                description: "the item push into the array",
            },
            items: {
                type: "array",
                description: "items push into the array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2], item: 3 },
            params: {},
            result: { array: [1, 2, 3] },
        },
        {
            inputs: { array: [true, false], item: false },
            params: {},
            result: { array: [true, false, false] },
        },
        {
            inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
            params: {},
            result: { array: [{ apple: 1 }, { lemon: 2 }] },
        },
        {
            inputs: { array: [{ apple: 1 }], items: [{ lemon: 2 }, { banana: 3 }] },
            params: {},
            result: { array: [{ apple: 1 }, { lemon: 2 }, { banana: 3 }] },
        },
        {
            inputs: { array: [1, 2], item: 3 },
            params: { arrayKey: "test" },
            result: { test: [1, 2, 3] },
        },
    ],
    description: "push Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/push_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const popAgent = async ({ namedInputs }) => {
    arrayValidate("popAgent", namedInputs);
    const array = [...namedInputs.array]; // shallow copy
    const item = array.pop();
    return { array, item };
};
const popAgentInfo = {
    name: "popAgent",
    agent: popAgent,
    mock: popAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to pop an item from",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item popped from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
            params: {},
            result: {
                array: ["a", "b"],
                item: "c",
            },
        },
        {
            inputs: {
                array: [1, 2, 3],
                array2: ["a", "b", "c"],
            },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
    ],
    description: "Pop Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/pop_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const shiftAgent = async ({ namedInputs }) => {
    arrayValidate("shiftAgent", namedInputs);
    const array = namedInputs.array.map((item) => item); // shallow copy
    const item = array.shift();
    return { array, item };
};
const shiftAgentInfo = {
    name: "shiftAgent",
    agent: shiftAgent,
    mock: shiftAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to shift an item from",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item shifted from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [2, 3],
                item: 1,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
            params: {},
            result: {
                array: ["b", "c"],
                item: "a",
            },
        },
    ],
    description: "shift Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/shift_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const arrayFlatAgent = async ({ namedInputs, params }) => {
    arrayValidate("arrayFlatAgent", namedInputs);
    const depth = params.depth ?? 1;
    const array = namedInputs.array.map((item) => item); // shallow copy
    return { array: array.flat(depth) };
};
const arrayFlatAgentInfo = {
    name: "arrayFlatAgent",
    agent: arrayFlatAgent,
    mock: arrayFlatAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "The array to be flattened",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "flattened array",
            },
        },
    },
    params: {
        type: "object",
        properties: {
            depth: {
                type: "number",
                description: "flattening depth",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                array: [1, 2, [3]],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: { depth: 2 },
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                array: ["a", "b", "c"],
            },
        },
    ],
    description: "Array Flat Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_flat_agent.ts",
    package: "@graphai/vanilla",
    cacheType: "pureAgent",
    license: "MIT",
};

const arrayJoinAgent = async ({ namedInputs, params }) => {
    arrayValidate("arrayJoinAgent", namedInputs);
    const separator = params.separator ?? "";
    const { flat } = params;
    const text = flat ? namedInputs.array.flat(flat).join(separator) : namedInputs.array.join(separator);
    return { text };
};
const arrayJoinAgentInfo = {
    name: "arrayJoinAgent",
    agent: arrayJoinAgent,
    mock: arrayJoinAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "array join",
            },
        },
        required: ["array"],
    },
    params: {
        type: "object",
        properties: {
            separator: {
                type: "string",
                description: "array join separator",
            },
            flat: {
                type: "number",
                description: "array flat depth",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "joined text",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                text: "123",
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                text: "123",
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                text: "abc",
            },
        },
        //
        {
            inputs: { array: [[1], [2], [3]] },
            params: { separator: "|" },
            result: {
                text: "1|2|3",
            },
        },
        {
            inputs: { array: [[[1]], [[2], [3]]] },
            params: { separator: "|" },
            result: {
                text: "1|2,3",
            },
        },
        {
            inputs: { array: [[[1]], [[2], [3]]] },
            params: { separator: "|", flat: 1 },
            result: {
                text: "1|2|3",
            },
        },
        {
            inputs: { array: [[[[1]], [[2], [3]]]] },
            params: { separator: "|", flat: 1 },
            result: {
                text: "1|2,3",
            },
        },
        {
            inputs: { array: [[[[1]], [[2], [3]]]] },
            params: { separator: "|", flat: 2 },
            result: {
                text: "1|2|3",
            },
        },
    ],
    description: "Array Join Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_join_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const arrayToObjectAgent = async ({ params, namedInputs }) => {
    assert(isNamedInputs(namedInputs), "arrayToObjectAgent: namedInputs is UNDEFINED!");
    const { items } = namedInputs;
    const { key } = params;
    assert(items !== undefined && Array.isArray(items), "arrayToObjectAgent: namedInputs.items is not array!");
    assert(key !== undefined && key !== null, "arrayToObjectAgent: params.key is UNDEFINED!");
    return namedInputs.items.reduce((tmp, current) => {
        tmp[current[key]] = current;
        return tmp;
    }, {});
};
const arrayToObjectAgentInfo = {
    name: "arrayToObjectAgent",
    agent: arrayToObjectAgent,
    mock: arrayToObjectAgent,
    inputs: {
        type: "object",
        properties: {
            items: {
                type: "array",
                description: "the array to pop an item from",
            },
        },
        required: ["items"],
    },
    output: {
        type: "object",
        properties: {
            anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
            description: "the item popped from the array",
        },
    },
    samples: [
        {
            inputs: {
                items: [
                    { id: 1, data: "a" },
                    { id: 2, data: "b" },
                ],
            },
            params: { key: "id" },
            result: {
                "1": { id: 1, data: "a" },
                "2": { id: 2, data: "b" },
            },
        },
    ],
    description: "Array To Object Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_to_object.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  matrix: Two dimentional array of numbers.
//  vector: One dimentional array of numbers.
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
const dotProductAgent = async ({ namedInputs, }) => {
    assert(!!namedInputs, "dotProductAgent: namedInputs is UNDEFINED!");
    const matrix = namedInputs.matrix;
    const vector = namedInputs.vector;
    if (matrix[0].length != vector.length) {
        throw new Error(`dotProduct: Length of vectors do not match. ${matrix[0].length}, ${vector.length}`);
    }
    const contents = matrix.map((vector0) => {
        return vector0.reduce((dotProduct, value, index) => {
            return dotProduct + value * vector[index];
        }, 0);
    });
    return contents;
};
const dotProductAgentInfo = {
    name: "dotProductAgent",
    agent: dotProductAgent,
    mock: dotProductAgent,
    inputs: {
        type: "object",
        properties: {
            matrix: {
                type: "array",
                description: "A two-dimensional array of numbers. Each inner array represents a vector to be compared.",
                items: {
                    type: "array",
                    items: {
                        type: "number",
                        description: "A numeric value within a vector.",
                    },
                    description: "A vector of numbers (row in the matrix).",
                },
            },
            vector: {
                type: "array",
                description: "A single vector of numbers to compute dot products with each vector in the matrix.",
                items: {
                    type: "number",
                    description: "A numeric component of the target vector.",
                },
            },
        },
        required: ["matrix", "vector"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "No parameters are used in this agent.",
        properties: {},
        additionalProperties: false,
    },
    output: {
        type: "array",
        description: "An array of numbers representing the dot products between each vector in 'matrix' and the input 'vector'.",
        items: {
            type: "number",
            description: "The result of a dot product between a matrix row and the input vector.",
        },
    },
    samples: [
        {
            inputs: {
                matrix: [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                ],
                vector: [3, 2],
            },
            params: {},
            result: [7, 17, 27],
        },
        {
            inputs: {
                matrix: [
                    [1, 2],
                    [2, 3],
                ],
                vector: [1, 2],
            },
            params: {},
            result: [5, 8],
        },
    ],
    description: "dotProduct Agent",
    category: ["matrix"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/matrix_agents/dot_product_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

// This agent returned a sorted array of one array (A) based on another array (B).
// The default sorting order is "decendant".
//
// Parameters:
//  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
// Inputs:
//  array: Array<any>; // array to be sorted
//  values: Array<number>; // array of numbers for sorting
//
const sortByValuesAgent = async ({ params, namedInputs }) => {
    assert(!!namedInputs, "sortByValue: namedInputs is UNDEFINED!");
    assert(!!namedInputs.array, "sortByValue: namedInputs.array is UNDEFINED!");
    assert(!!namedInputs.values, "sortByValue: namedInputs.values is UNDEFINED!");
    const direction = (params?.assendant ?? false) ? -1 : 1;
    const array = namedInputs.array;
    const values = namedInputs.values;
    const joined = array.map((item, index) => {
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
const sortByValuesAgentInfo = {
    name: "sortByValuesAgent",
    agent: sortByValuesAgent,
    mock: sortByValuesAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "The array of items to be sorted. Each item will be paired with a corresponding numeric value from the 'values' array.",
            },
            values: {
                type: "array",
                description: "An array of numeric values used to determine the sort order of the 'array' items. Must be the same length as 'array'.",
                items: {
                    type: "number",
                },
            },
        },
        required: ["array", "values"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            assendant: {
                type: "boolean",
                description: "If true, sorts in ascending order; otherwise, in descending order (default).",
            },
        },
        additionalProperties: false,
    },
    output: {
        type: "array",
        description: "A new array where items from 'array' are sorted based on their corresponding values in 'values'.",
        items: {
            type: "any",
        },
    },
    samples: [
        {
            inputs: {
                array: ["banana", "orange", "lemon", "apple"],
                values: [2, 5, 6, 4],
            },
            params: {},
            result: ["lemon", "orange", "apple", "banana"],
        },
        {
            inputs: {
                array: ["banana", "orange", "lemon", "apple"],
                values: [2, 5, 6, 4],
            },
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
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/matrix_agents/sort_by_values_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const echoAgent = async ({ params, filterParams }) => {
    if (params.filterParams) {
        return filterParams;
    }
    return params;
};
// for test and document
const echoAgentInfo = {
    name: "echoAgent",
    agent: echoAgent,
    mock: echoAgent,
    inputs: {
        type: "object",
        description: "This agent does not use inputs. Leave empty.",
        properties: {},
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "Any parameters you want to echo back. If 'filterParams' is true, only filtered parameters will be returned.",
        properties: {
            filterParams: {
                type: "boolean",
                description: "If true, returns 'filterParams' instead of the full 'params'.",
            },
        },
        additionalProperties: true,
    },
    output: {
        type: "object",
        description: "Returns the full 'params' object or the 'filterParams' object if 'filterParams' is set to true.",
        additionalProperties: true,
    },
    samples: [
        {
            inputs: {},
            params: { text: "this is test" },
            result: { text: "this is test" },
        },
        {
            inputs: {},
            params: {
                text: "If you add filterParams option, it will respond to filterParams",
                filterParams: true,
            },
            result: {},
        },
    ],
    description: "Echo agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/echo_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const countingAgent = async ({ params }) => {
    return {
        list: new Array(params.count).fill(undefined).map((_, i) => {
            return i;
        }),
    };
};
// for test and document
const countingAgentInfo = {
    name: "countingAgent",
    agent: countingAgent,
    mock: countingAgent,
    inputs: {
        type: "object",
        description: "This agent does not require any inputs. Leave empty.",
        properties: {},
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "Parameter that defines how many numbers to generate, starting from 0.",
        properties: {
            count: {
                type: "integer",
                minimum: 0,
                description: "The number of integers to generate, starting from 0 up to count - 1.",
            },
        },
        required: ["count"],
        additionalProperties: false,
    },
    output: {
        type: "object",
        description: "An object containing a list of sequential integers.",
        properties: {
            list: {
                type: "array",
                description: "An array of integers from 0 to count - 1.",
                items: {
                    type: "integer",
                },
            },
        },
        required: ["list"],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: {},
            params: { count: 4 },
            result: { list: [0, 1, 2, 3] },
        },
    ],
    description: "Counting agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/counting_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const copyMessageAgent = async ({ params }) => {
    return {
        messages: new Array(params.count).fill(undefined).map(() => {
            return params.message;
        }),
    };
};
// for test and document
const copyMessageAgentInfo = {
    name: "copyMessageAgent",
    agent: copyMessageAgent,
    mock: copyMessageAgent,
    inputs: {
        type: "object",
        description: "This agent does not use any inputs. Leave empty.",
        properties: {},
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "Parameters to define the message and how many times to repeat it.",
        properties: {
            count: {
                type: "integer",
                minimum: 1,
                description: "The number of times the message should be duplicated in the array.",
            },
            message: {
                type: "string",
                description: "The message string to be repeated.",
            },
        },
        required: ["count", "message"],
        additionalProperties: false,
    },
    output: {
        type: "object",
        description: "An object containing the repeated messages.",
        properties: {
            messages: {
                type: "array",
                description: "An array of repeated message strings.",
                items: {
                    type: "string",
                },
            },
        },
        required: ["messages"],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: {},
            params: { count: 4, message: "hello" },
            result: { messages: ["hello", "hello", "hello", "hello"] },
        },
    ],
    description: "CopyMessage agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy_message_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const copy2ArrayAgent = async ({ namedInputs, params }) => {
    assert(isNamedInputs(namedInputs), "copy2ArrayAgent: namedInputs is UNDEFINED!");
    const input = namedInputs.item ? namedInputs.item : namedInputs;
    return new Array(params.count).fill(undefined).map(() => {
        return input;
    });
};
// for test and document
const copy2ArrayAgentInfo = {
    name: "copy2ArrayAgent",
    agent: copy2ArrayAgent,
    mock: copy2ArrayAgent,
    inputs: {
        type: "object",
        description: "The input item to be duplicated. Can be provided as 'item' or as a free-form object.",
        properties: {
            item: {
                description: "The item to be copied into each element of the resulting array.",
                anyOf: [{ type: "object" }, { type: "string" }, { type: "number" }, { type: "array" }, { type: "boolean" }],
            },
        },
        additionalProperties: true,
    },
    params: {
        type: "object",
        description: "Parameters controlling the number of copies to return.",
        properties: {
            count: {
                type: "integer",
                description: "The number of times to copy the input item into the output array.",
                minimum: 1,
            },
        },
        required: ["count"],
        additionalProperties: false,
    },
    output: {
        type: "array",
        description: "An array of 'count' copies of the input item.",
        items: {
            description: "A duplicated copy of the input item.",
            anyOf: [{ type: "object" }, { type: "string" }, { type: "number" }, { type: "array" }, { type: "boolean" }],
        },
    },
    samples: [
        {
            inputs: { item: { message: "hello" } },
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
        {
            inputs: { message: "hello" },
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
        {
            inputs: { item: "hello" },
            params: { count: 10 },
            result: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
        },
    ],
    description: "Copy2Array agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy2array_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, namedInputs, }) => {
    arrayValidate("mergeNodeIdAgent", namedInputs);
    const dataSet = namedInputs.array;
    return dataSet.reduce((tmp, input) => {
        return { ...tmp, ...input };
    }, { [nodeId]: "hello" });
};
// for test and document
const mergeNodeIdAgentInfo = {
    name: "mergeNodeIdAgent",
    agent: mergeNodeIdAgent,
    mock: mergeNodeIdAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "An array of objects to be merged together into a single object. Each object represents a partial result or state.",
                items: {
                    type: "object",
                    description: "A single object containing key-value pairs to merge.",
                },
            },
        },
        required: ["array"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "This agent does not take any parameters. The object must be empty.",
        properties: {},
        additionalProperties: false,
    },
    samples: [
        {
            inputs: { array: [{ message: "hello" }] },
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
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/merge_node_id_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const streamMockAgent = async ({ params, filterParams, namedInputs, }) => {
    const message = params.message ?? namedInputs.message ?? "";
    for await (const token of message.split("")) {
        if (filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback(token);
        }
        await sleep(params.sleep || 100);
    }
    return { message };
};
// for test and document
const streamMockAgentInfo = {
    name: "streamMockAgent",
    agent: streamMockAgent,
    mock: streamMockAgent,
    inputs: {
        anyOf: [
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "streaming message",
                    },
                },
            },
            {
                type: "array",
            },
        ],
    },
    samples: [
        {
            inputs: {},
            params: { message: "this is params test" },
            result: { message: "this is params test" },
        },
        {
            inputs: { message: "this is named inputs test" },
            params: {},
            result: { message: "this is named inputs test" },
        },
    ],
    description: "Stream mock agent",
    category: ["test"],
    author: "Isamu Arimoto",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/stream_mock_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
    stream: true,
};

const mapAgent = async ({ params, namedInputs, log, debugInfo, forNestedGraph }) => {
    assert(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");
    const { limit, resultAll, compositeResult, compositeResultKey, supressError, rowKey, expandKeys } = params;
    const { agents, graphData, graphOptions, onLogCallback, callbacks } = forNestedGraph;
    const { taskManager } = graphOptions;
    if (taskManager) {
        const status = taskManager.getStatus();
        assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
    }
    assert(!!namedInputs.rows, "mapAgent: rows property is required in namedInput");
    assert(!!graphData, "mapAgent: graph is required");
    const rows = namedInputs.rows.map((item) => item);
    if (limit && limit < rows.length) {
        rows.length = limit; // trim
    }
    const rowInputKey = rowKey ?? "row";
    const { nodes } = graphData;
    const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy
    const nodeIds = Object.keys(namedInputs);
    nestedGraphData.nodes["__mapIndex"] = {};
    nodeIds.forEach((nodeId) => {
        const mappedNodeId = nodeId === "rows" ? rowInputKey : nodeId;
        if (nestedGraphData.nodes[mappedNodeId] === undefined) {
            // If the input node does not exist, automatically create a static node
            nestedGraphData.nodes[mappedNodeId] = { value: namedInputs[nodeId] };
        }
        else if (!("agent" in nestedGraphData.nodes[mappedNodeId])) {
            // Otherwise, inject the proper data here (instead of calling injectTo method later)
            nestedGraphData.nodes[mappedNodeId]["value"] = namedInputs[nodeId];
        }
    });
    try {
        if (nestedGraphData.version === undefined && debugInfo.version) {
            nestedGraphData.version = debugInfo.version;
        }
        const graphs = rows.map((row, index) => {
            const graphAI = new GraphAI(nestedGraphData, agents || {}, { ...(graphOptions ?? {}), mapIndex: index });
            debugInfo.subGraphs.set(graphAI.graphId, graphAI);
            graphAI.injectValue(rowInputKey, row, "__mapAgent_inputs__");
            graphAI.injectValue("__mapIndex", index, "__mapAgent_inputs__");
            if (expandKeys && expandKeys.length > 0) {
                expandKeys.map((expandKey) => {
                    graphAI.injectValue(expandKey, namedInputs[expandKey]?.[index]);
                });
            }
            // for backward compatibility. Remove 'if' later
            if (onLogCallback) {
                graphAI.onLogCallback = onLogCallback;
            }
            if (callbacks) {
                graphAI.callbacks = callbacks;
            }
            return graphAI;
        });
        const runs = graphs.map((graph) => {
            return graph.run(resultAll);
        });
        const results = await Promise.all(runs);
        const nodeIds = Object.keys(results[0]);
        // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
        graphs.map((graph) => {
            debugInfo.subGraphs.delete(graph.graphId);
        });
        if (log) {
            const logs = graphs.map((graph, index) => {
                return graph.transactionLogs().map((log) => {
                    log.mapIndex = index;
                    return log;
                });
            });
            log.push(...logs.flat());
        }
        if (compositeResult || compositeResultKey) {
            const _compositeResult = nodeIds.reduce((tmp, nodeId) => {
                tmp[nodeId] = results.map((result) => {
                    return result[nodeId];
                });
                return tmp;
            }, {});
            if (compositeResultKey) {
                return _compositeResult[compositeResultKey];
            }
            return _compositeResult;
        }
        return results;
    }
    catch (error) {
        if (error instanceof Error && supressError) {
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
const mapAgentInfo = {
    name: "mapAgent",
    agent: mapAgent,
    mock: mapAgent,
    samples: [
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon"],
                color: ["red", "orange", "yellow", "yellow"],
            },
            params: {
                compositeResult: true,
                expandKeys: ["color"],
            },
            graph: {
                version: 0.5,
                nodes: {
                    node2: {
                        agent: "copyAgent",
                        inputs: { a: ":row", b: ":color" },
                        isResult: true,
                    },
                },
            },
            result: {
                node2: [
                    {
                        a: "apple",
                        b: "red",
                    },
                    {
                        a: "orange",
                        b: "orange",
                    },
                    {
                        a: "banana",
                        b: "yellow",
                    },
                    {
                        a: "lemon",
                        b: "yellow",
                    },
                ],
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {},
            result: [{ test: [1] }, { test: [2] }],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: { rowKey: "myKey" },
            result: [{ test: [1] }, { test: [2] }],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":myKey"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${word}.",
                        },
                        inputs: { word: ":row" },
                        isResult: true,
                    },
                },
            },
            result: [
                { node2: "I love apple." },
                { node2: "I love orange." },
                { node2: "I love banana." },
                { node2: "I love lemon." },
                { node2: "I love melon." },
                { node2: "I love pineapple." },
                { node2: "I love tomato." },
            ],
        },
        {
            inputs: {
                rows: [{ fruit: "apple" }, { fruit: "orange" }],
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${item}.",
                        },
                        inputs: { item: ":row.fruit" },
                        isResult: true,
                    },
                },
            },
            result: [{ node2: "I love apple." }, { node2: "I love orange." }],
        },
        {
            inputs: {
                rows: [{ fruit: "apple" }, { fruit: "orange" }],
                name: "You",
                verb: "like",
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "${name} ${verb} ${fruit}.",
                        },
                        inputs: { fruit: ":row.fruit", name: ":name", verb: ":verb" },
                        isResult: true,
                    },
                },
            },
            result: [{ node2: "You like apple." }, { node2: "You like orange." }],
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
            },
            result: [
                {
                    __mapIndex: 0,
                    test: [1],
                    row: 1,
                },
                {
                    __mapIndex: 1,
                    test: [2],
                    row: 2,
                },
            ],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
            },
            result: [
                {
                    __mapIndex: 0,
                    map: [
                        {
                            test: 1,
                        },
                        {
                            test: 1,
                        },
                    ],
                    row: 1,
                    test: 1,
                },
                {
                    __mapIndex: 1,
                    map: [
                        {
                            test: 2,
                        },
                        {
                            test: 2,
                        },
                    ],
                    test: 2,
                    row: 2,
                },
            ],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "row" },
                        inputs: { row: ":row" },
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "copyAgent",
                                    params: { namedKey: "row" },
                                    inputs: { row: ":row" },
                                },
                            },
                        },
                    },
                },
            },
        },
        // old response
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {
                compositeResult: true,
            },
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${row}.",
                        },
                        inputs: { row: ":row" },
                        isResult: true,
                    },
                },
            },
            result: {
                node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {
                compositeResult: true,
                compositeResultKey: "node2",
            },
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${row}.",
                        },
                        inputs: { row: ":row" },
                        isResult: true,
                    },
                },
            },
            result: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
                __mapIndex: [0, 1],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
                compositeResult: true,
            },
            result: {
                __mapIndex: [0, 1],
                test: [[1], [2]],
                map: [
                    {
                        test: [[[1]], [[1]]],
                    },
                    {
                        test: [[[2]], [[2]]],
                    },
                ],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        params: {
                            compositeResult: true,
                        },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "copyAgent",
                                    params: { namedKey: "rows" },
                                    inputs: { rows: [":row"] },
                                },
                            },
                        },
                    },
                },
            },
        },
    ],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/map_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const totalAgent = async ({ namedInputs, params, }) => {
    const { flatResponse } = params;
    assert(isNamedInputs(namedInputs), "totalAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    assert(!!namedInputs?.array, "totalAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    const response = namedInputs.array.reduce((result, input) => {
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
    if (flatResponse) {
        return response;
    }
    return { data: response };
};
//
const totalAgentInfo = {
    name: "totalAgent",
    agent: totalAgent,
    mock: totalAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "An array of objects or arrays of objects. Each inner object must have numeric values which will be aggregated by key.",
                items: {
                    anyOf: [
                        {
                            type: "object",
                            description: "A flat object containing numeric values to be summed.",
                        },
                        {
                            type: "array",
                            items: {
                                type: "object",
                                description: "Nested array of objects, each containing numeric values to be summed.",
                            },
                        },
                    ],
                },
            },
        },
        required: ["array"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            flatResponse: {
                type: "boolean",
                description: "If true, the result will be returned as a plain object (e.g., { a: 6 }); otherwise, wrapped in { data: {...} }.",
            },
        },
        additionalProperties: false,
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { data: { a: 6 } },
        },
        {
            inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
            params: {},
            result: { data: { a: 6, b: -4, c: 10, d: -10 } },
        },
        {
            inputs: { array: [{ a: 1 }] },
            params: {},
            result: { data: { a: 1 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }] },
            params: {},
            result: { data: { a: 3 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { data: { a: 6 } },
        },
        {
            inputs: {
                array: [
                    { a: 1, b: 1 },
                    { a: 2, b: 2 },
                    { a: 3, b: 0 },
                ],
            },
            params: {},
            result: { data: { a: 6, b: 3 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
            params: {},
            result: { data: { a: 6, b: 2 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: { flatResponse: true },
            result: { a: 6 },
        },
        {
            inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
            params: { flatResponse: true },
            result: { a: 6, b: -4, c: 10, d: -10 },
        },
        {
            inputs: { array: [{ a: 1 }] },
            params: { flatResponse: true },
            result: { a: 1 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }] },
            params: { flatResponse: true },
            result: { a: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: { flatResponse: true },
            result: { a: 6 },
        },
        {
            inputs: {
                array: [
                    { a: 1, b: 1 },
                    { a: 2, b: 2 },
                    { a: 3, b: 0 },
                ],
            },
            params: { flatResponse: true },
            result: { a: 6, b: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
            params: { flatResponse: true },
            result: { a: 6, b: 2 },
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/snakajima/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/total_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const dataSumTemplateAgent = async ({ namedInputs, params, }) => {
    const { flatResponse } = params;
    assert(isNamedInputs(namedInputs), "dataSumTemplateAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    assert(!!namedInputs?.array, "dataSumTemplateAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    const sum = namedInputs.array.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
    if (flatResponse) {
        return sum;
    }
    return { result: sum };
};
const dataSumTemplateAgentInfo = {
    name: "dataSumTemplateAgent",
    agent: dataSumTemplateAgent,
    mock: dataSumTemplateAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array of numbers to calculate the sum of",
                items: {
                    type: "integer",
                },
            },
        },
        required: ["array"],
    },
    output: {
        type: "number",
    },
    samples: [
        {
            inputs: { array: [1] },
            params: {},
            result: { result: 1 },
        },
        {
            inputs: { array: [1, 2] },
            params: {},
            result: { result: 3 },
        },
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: { result: 6 },
        },
        {
            inputs: { array: [1] },
            params: { flatResponse: true },
            result: 1,
        },
        {
            inputs: { array: [1, 2] },
            params: { flatResponse: true },
            result: 3,
        },
        {
            inputs: { array: [1, 2, 3] },
            params: { flatResponse: true },
            result: 6,
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/data_sum_template_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const applyFilter = (object, index, arrayInputs, include, exclude, alter, inject, swap, inspect) => {
    const propIds = include ? include : Object.keys(object);
    const excludeSet = new Set(exclude ?? []);
    const result = propIds.reduce((tmp, propId) => {
        if (!excludeSet.has(propId)) {
            const mapping = alter && alter[propId];
            if (mapping && mapping[object[propId]]) {
                tmp[propId] = mapping[object[propId]];
            }
            else {
                tmp[propId] = object[propId];
            }
        }
        return tmp;
    }, {});
    if (inject) {
        inject.forEach((item) => {
            if (item.index === undefined || item.index === index) {
                result[item.propId] = arrayInputs[item.from];
            }
        });
    }
    if (inspect) {
        inspect.forEach((item) => {
            const value = arrayInputs[item.from ?? 1]; // default is arrayInputs[1]
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
const propertyFilterAgent = async ({ namedInputs, params }) => {
    const { include, exclude, alter, inject, swap, inspect } = params;
    const { array, item } = namedInputs;
    if (array) {
        // This is advanced usage, including "inject" and "inspect", which uses
        // array[1], array[2], ...
        const [target] = array; // Extract the first one
        if (Array.isArray(target)) {
            return target.map((item, index) => applyFilter(item, index, array, include, exclude, alter, inject, swap, inspect));
        }
        return applyFilter(target, 0, array, include, exclude, alter, inject, swap, inspect);
    }
    else if (item) {
        return applyFilter(item, 0, [], include, exclude, alter, inject, swap, inspect);
    }
    return false;
};
const testInputs = {
    array: [
        [
            { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
            { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
        ],
        "Tesla Motors",
    ],
};
const propertyFilterAgentInfo = {
    name: "propertyFilterAgent",
    agent: propertyFilterAgent,
    mock: propertyFilterAgent,
    inputs: {
        type: "object",
    },
    output: {
        type: "any",
        properties: {
            array: {
                type: "array",
                description: "the array to apply filter",
            },
            item: {
                type: "object",
                description: "the object to apply filter",
            },
        },
    },
    samples: [
        {
            inputs: { array: [testInputs.array[0][0]] },
            params: { include: ["color", "model"] },
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: { item: testInputs.array[0][0] },
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
            inputs: { item: testInputs.array[0][0] },
            params: { exclude: ["color", "model"] },
            result: { type: "EV", maker: "Tesla", range: 300 },
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
            inputs: { item: testInputs.array[0][0] },
            params: { alter: { color: { red: "blue", blue: "red" } } },
            result: {
                color: "blue",
                model: "Model 3",
                type: "EV",
                maker: "Tesla",
                range: 300,
            },
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
            inputs: { item: testInputs.array[0][0] },
            params: { swap: { maker: "model" } },
            result: {
                color: "red",
                model: "Tesla",
                type: "EV",
                maker: "Model 3",
                range: 300,
            },
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
    description: "Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/property_filter_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const copyAgent = async ({ namedInputs, params }) => {
    const { namedKey } = params;
    assert(isNamedInputs(namedInputs), "copyAgent: namedInputs is UNDEFINED!");
    if (namedKey) {
        return namedInputs[namedKey];
    }
    return namedInputs;
};
const copyAgentInfo = {
    name: "copyAgent",
    agent: copyAgent,
    mock: copyAgent,
    inputs: {
        type: "object",
        description: "A dynamic object containing any number of named input fields. The agent either returns the whole object or a single value by key.",
        additionalProperties: {
            type: ["string", "number", "boolean", "object", "array", "null"],
            description: "A value associated with a named input key. Can be any JSON-compatible type.",
        },
    },
    params: {
        type: "object",
        properties: {
            namedKey: {
                type: "string",
                description: "If specified, the agent will return only the value associated with this key from namedInputs.",
            },
        },
        additionalProperties: false,
    },
    output: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    samples: [
        {
            inputs: { color: "red", model: "Model 3" },
            params: {},
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: { array: ["Hello World", "Discarded"] },
            params: {},
            result: { array: ["Hello World", "Discarded"] },
        },
        {
            inputs: { color: "red", model: "Model 3" },
            params: { namedKey: "color" },
            result: "red",
        },
    ],
    description: "Returns namedInputs",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/copy_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const lookupDictionaryAgent = async ({ namedInputs, params }) => {
    const { namedKey } = namedInputs;
    assert(isNamedInputs(namedInputs), "lookupDictionaryAgent: namedInputs is UNDEFINED!");
    const result = params[namedKey];
    if (!params.supressError && result === undefined) {
        throw new Error(`lookupDictionaryAgent error: ${namedKey} is missing`);
    }
    return result;
};
const exampleParams = {
    openai: {
        model: "gpt4-o",
        temperature: 0.7,
    },
    groq: {
        model: "llama3-8b-8192",
        temperature: 0.6,
    },
    gemini: {
        model: "gemini-2.0-pro-exp-02-05",
        temperature: 0.7,
    },
};
const lookupDictionaryAgentInfo = {
    name: "lookupDictionaryAgent",
    agent: lookupDictionaryAgent,
    mock: lookupDictionaryAgent,
    inputs: {
        type: "object",
        properties: {
            namedKey: {
                type: "string",
                description: "The key to look up in the dictionary provided by 'params'.",
            },
            supressError: {
                type: "boolean",
                description: "If true, prevents the agent from throwing an error when the key is missing in 'params'. Optional.",
            },
        },
        required: ["namedKey"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "A dictionary of values from which one is selected using the 'namedKey'.",
        additionalProperties: {
            type: ["string", "number", "boolean", "object", "array", "null"],
            description: "Any JSON-compatible value associated with a key in the dictionary.",
        },
    },
    output: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    samples: [
        {
            inputs: { namedKey: "openai" },
            params: exampleParams,
            result: {
                model: "gpt4-o",
                temperature: 0.7,
            },
        },
        {
            inputs: { namedKey: "gemini" },
            params: exampleParams,
            result: {
                model: "gemini-2.0-pro-exp-02-05",
                temperature: 0.7,
            },
        },
    ],
    description: "Select elements with params",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/lookup_dictionary_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const mergeObjectAgent = async ({ namedInputs }) => {
    assert(isNamedInputs(namedInputs), "mergeObjectAgent: namedInputs is UNDEFINED!");
    const { items } = namedInputs;
    assert(items !== undefined && Array.isArray(items), "mergeObjectAgent: namedInputs.items is not array!");
    return Object.assign({}, ...items);
};
const mergeObjectAgentInfo = {
    name: "mergeObjectAgent",
    agent: mergeObjectAgent,
    mock: mergeObjectAgent,
    inputs: {
        type: "object",
        properties: {
            items: {
                type: "array",
                description: "An array of objects whose key-value pairs will be merged into a single object. Later objects override earlier ones on key conflict.",
                items: {
                    type: "object",
                    description: "An individual object contributing to the merged result.",
                },
            },
        },
        required: ["items"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        description: "This agent does not take any parameters. The object must be empty.",
        properties: {},
        additionalProperties: false,
    },
    output: {
        anyOf: { type: "object" },
    },
    samples: [
        {
            inputs: { items: [{ color: "red" }, { model: "Model 3" }] },
            params: {},
            result: { color: "red", model: "Model 3" },
        },
    ],
    description: "Returns namedInputs",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/merge_objects_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const allowedMethods = ["GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "PATCH" /* "TRACE" */];
const methodsRequiringBody = ["POST", "PUT", "PATCH"];
/*
  For compatibility, we are adding GraphAIFlatResponse to the parameters.
 By default, it is usually set to false, but it will be set to true for use in tutorials and similar cases.
 In the future, flat responses (non-object results) will be deprecated.
 Until then, we will set flatResponse to false using vanillaFetch and transition to object-based responses.
 Eventually, this option will be removed, and it will be ignored at runtime, always returning an object.
 */
const vanillaFetchAgent = async ({ namedInputs, params, config }) => {
    const { url, method, queryParams, body } = {
        ...params,
        ...namedInputs,
    };
    assert(!!url, "fetchAgent: no url");
    const supressError = params.supressError ?? false;
    const url0 = new URL(url);
    const headers0 = {
        ...(params.headers ? params.headers : {}),
        ...(namedInputs.headers ? namedInputs.headers : {}),
    };
    if (config && config.authorization) {
        headers0["Authorization"] = config.authorization;
    }
    if (queryParams) {
        const _params = new URLSearchParams(queryParams);
        url0.search = _params.toString();
    }
    if (body) {
        headers0["Content-Type"] = "application/json";
    }
    //
    const fetchOptions = {
        method: method ? method.toUpperCase() : body ? "POST" : "GET",
        headers: new Headers(headers0),
        body: body ? JSON.stringify(body) : undefined,
    };
    assert(allowedMethods.includes(fetchOptions.method ?? ""), "fetchAgent: invalid method: " + fetchOptions.method);
    assert(!methodsRequiringBody.includes(fetchOptions.method ?? "") || !!body, "fetchAgent: The request body is required for this method: " + fetchOptions.method);
    if (params?.debug) {
        return {
            url: url0.toString(),
            method: fetchOptions.method,
            headers: headers0,
            body: fetchOptions.body,
        };
    }
    const response = await fetch(url0.toString(), fetchOptions);
    if (!response.ok) {
        const status = response.status;
        const type = params?.type ?? "json";
        const error = type === "json" ? await response.json() : await response.text();
        if (supressError) {
            return {
                onError: {
                    message: `HTTP error: ${status}`,
                    status,
                    error,
                },
            };
        }
        throw new Error(`HTTP error: ${status}`);
    }
    const data = await (async () => {
        const type = params?.type ?? "json";
        if (type === "json") {
            return await response.json();
        }
        else if (type === "text") {
            return response.text();
        }
        throw new Error(`Unknown Type! ${type}`);
    })();
    if (params.flatResponse === false) {
        return { data };
    }
    return data;
};
const vanillaFetchAgentInfo = {
    name: "vanillaFetchAgent",
    agent: vanillaFetchAgent,
    mock: vanillaFetchAgent,
    inputs: {
        type: "object",
        properties: {
            url: {
                type: "string",
                description: "The request URL. Can be provided in either 'inputs' or 'params'.",
            },
            method: {
                type: "string",
                description: "The HTTP method to use (GET, POST, PUT, etc.). Defaults to GET if not specified and no body is provided; otherwise POST.",
            },
            headers: {
                type: "object",
                description: "Optional HTTP headers to include in the request. Values from both inputs and params are merged.",
            },
            queryParams: {
                type: "object",
                description: "Optional query parameters to append to the URL.",
            },
            body: {
                description: "Optional request body to send with POST, PUT, or PATCH methods.",
                anyOf: [{ type: "string" }, { type: "object" }],
            },
        },
        required: [],
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            url: {
                type: "string",
                description: "The request URL (overridden if also specified in inputs).",
            },
            method: {
                type: "string",
                description: "The HTTP method (overridden if also specified in inputs).",
            },
            headers: {
                type: "object",
                description: "Additional headers. Merged with inputs.headers.",
            },
            queryParams: {
                type: "object",
                description: "Query parameters to append to the URL.",
            },
            body: {
                description: "Request body to be sent, used with POST/PUT/PATCH.",
                anyOf: [{ type: "string" }, { type: "object" }],
            },
            debug: {
                type: "boolean",
                description: "If true, returns the prepared request details instead of performing the actual fetch.",
            },
            supressError: {
                type: "boolean",
                description: "If true, suppresses thrown errors and returns the error response instead.",
            },
            flatResponse: {
                type: "boolean",
                description: "If true, returns the raw response. If false, wraps the response in an object with a 'data' key. Default is false.",
            },
            type: {
                type: "string",
                enum: ["json", "text"],
                description: "Response type to parse. Either 'json' or 'text'. Defaults to 'json'.",
            },
        },
        required: [],
        additionalProperties: false,
    },
    output: {
        description: "Returns either the HTTP response body or a debug object. If an error occurs and 'supressError' is true, returns an object with an 'onError' key.",
        anyOf: [
            {
                type: "object",
                properties: {
                    onError: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            status: { type: "integer" },
                            error: {},
                        },
                        required: ["message", "status", "error"],
                    },
                },
                required: ["onError"],
                additionalProperties: true,
            },
            {
                type: "object",
                description: "Debug information returned when 'debug' is true.",
                properties: {
                    method: { type: "string" },
                    url: { type: "string" },
                    headers: { type: "object" },
                    body: {},
                },
                required: ["method", "url", "headers"],
            },
            {},
            {
                type: "object",
                description: "When 'flatResponse' is false, the response is wrapped as { data: ... }.",
                properties: {
                    data: {},
                },
                required: ["data"],
                additionalProperties: true,
            },
        ],
    },
    samples: [
        {
            inputs: { url: "https://example.com", queryParams: { foo: "bar" }, headers: { "x-myHeader": "secret" } },
            params: {
                debug: true,
            },
            result: {
                method: "GET",
                url: "https://example.com/?foo=bar",
                headers: {
                    "x-myHeader": "secret",
                },
                body: undefined,
            },
        },
        {
            inputs: { url: "https://example.com", body: { foo: "bar" } },
            params: {
                debug: true,
            },
            result: {
                method: "POST",
                url: "https://example.com/",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ foo: "bar" }),
            },
        },
        {
            inputs: { url: "https://example.com", body: { foo: "bar" }, method: "PUT" },
            params: {
                debug: true,
            },
            result: {
                method: "PUT",
                url: "https://example.com/",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ foo: "bar" }),
            },
        },
        {
            inputs: { url: "https://example.com", method: "options" },
            params: {
                debug: true,
            },
            result: {
                method: "OPTIONS",
                url: "https://example.com/",
                headers: {},
                body: undefined,
            },
        },
        {
            inputs: {},
            params: {
                url: "https://example.com",
                body: { foo: "bar" },
                method: "PUT",
                debug: true,
            },
            result: {
                method: "PUT",
                url: "https://example.com/",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ foo: "bar" }),
            },
        },
        {
            inputs: {
                method: "DELETE",
                headers: {
                    authentication: "bearer XXX",
                },
            },
            params: {
                url: "https://example.com",
                body: { foo: "bar" },
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                debug: true,
            },
            result: {
                method: "DELETE",
                url: "https://example.com/",
                headers: {
                    "Content-Type": "application/json",
                    authentication: "bearer XXX",
                },
                body: JSON.stringify({ foo: "bar" }),
            },
        },
    ],
    description: "Retrieves JSON data from the specified URL",
    category: ["service"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/service_agents/vanilla_fetch_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const sleeperAgent = async ({ params, namedInputs }) => {
    await sleep(params?.duration ?? 10);
    return namedInputs;
};
const sleeperAgentInfo = {
    name: "sleeperAgent",
    agent: sleeperAgent,
    mock: sleeperAgent,
    inputs: {
        type: "object",
        description: "Arbitrary input data. This agent does not modify it and returns it unchanged after a delay.",
        additionalProperties: true,
    },
    params: {
        type: "object",
        properties: {
            duration: {
                type: "number",
                description: "Optional duration in milliseconds to pause execution before returning the input. Defaults to 10ms.",
            },
        },
        additionalProperties: false,
    },
    output: {
        type: "object",
        description: "Returns the same object passed as 'inputs', unchanged.",
        additionalProperties: true,
    },
    samples: [
        {
            inputs: {},
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: { array: [{ a: 1 }, { b: 2 }] },
            params: { duration: 1 },
            result: {
                array: [{ a: 1 }, { b: 2 }],
            },
        },
    ],
    description: "sleeper Agent for test and debug",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/sleeper_agents/sleeper_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const compare = (_array) => {
    const array = _array.map((value) => {
        if (Array.isArray(value)) {
            return compare(value);
        }
        return value;
    });
    const [a, operator, b] = array;
    if (operator === "==") {
        return a === b;
    }
    if (operator === "!=") {
        return a !== b;
    }
    if (operator === ">") {
        return Number(a) > Number(b);
    }
    if (operator === ">=") {
        return Number(a) >= Number(b);
    }
    if (operator === "<") {
        return Number(a) < Number(b);
    }
    if (operator === "<=") {
        return Number(a) <= Number(b);
    }
    if (operator === "||") {
        return !!a || !!b;
    }
    if (operator === "&&") {
        return !!a && !!b;
    }
    if (operator === "XOR") {
        return !!a === !b;
    }
    throw new Error(`unknown compare operator`);
};
// TODO: move to agent_utils
const isNull = (data) => {
    return data === null || data === undefined;
};
const compareAgent = async ({ namedInputs, params }) => {
    const { array: _array, leftValue, rightValue } = namedInputs;
    const array = _array ?? [];
    const inputs = (() => {
        if (array.length === 2 && params.operator) {
            return [array[0], params.operator, array[1]];
        }
        if (array.length === 3) {
            return array;
        }
        if (array.length === 0 && !isNull(leftValue) && !isNull(rightValue) && params.operator) {
            return [leftValue, params.operator, rightValue];
        }
        throw new Error(`compare inputs is wrong.`);
    })();
    const ret = compare(inputs);
    if (params?.value) {
        return {
            result: params?.value[ret ? "true" : "false"] ?? ret,
        };
    }
    return {
        result: ret,
    };
};
const compareAgentInfo = {
    name: "compareAgent",
    agent: compareAgent,
    mock: compareAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "A 3-element array in the form [leftOperand, operator, rightOperand]. Used for direct comparison logic.",
                items: {
                    type: ["string", "number", "boolean", "array"],
                },
            },
            leftValue: {
                type: ["string", "number", "boolean"],
                description: "Left-hand operand used when 'array' is not provided. Used with 'rightValue' and 'params.operator'.",
            },
            rightValue: {
                type: ["string", "number", "boolean"],
                description: "Right-hand operand used when 'array' is not provided. Used with 'leftValue' and 'params.operator'.",
            },
        },
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            operator: {
                type: "string",
                description: "The comparison operator to apply, such as '==', '!=', '>', '>=', '<', '<=', '||', '&&', or 'XOR'. Required if 'array' does not include the operator.",
            },
            value: {
                type: "object",
                description: "An optional mapping for the comparison result. If provided, it must contain keys 'true' and/or 'false' to return custom values instead of booleans.",
                properties: {
                    true: {
                        type: ["string", "number", "boolean"],
                        description: "Custom result to return when the comparison evaluates to true.",
                    },
                    false: {
                        type: ["string", "number", "boolean"],
                        description: "Custom result to return when the comparison evaluates to false.",
                    },
                },
                additionalProperties: false,
            },
        },
        additionalProperties: false,
    },
    output: {},
    samples: [
        {
            inputs: { array: ["abc", "==", "abc"] },
            params: { value: { true: "a", false: "b" } },
            result: {
                result: "a",
            },
        },
        {
            inputs: { array: ["abc", "==", "abca"] },
            params: { value: { true: "a", false: "b" } },
            result: {
                result: "b",
            },
        },
        {
            inputs: { array: ["abc", "==", "abc"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["abc", "==", "abcd"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "!=", "abc"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "!=", "abcd"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", ">", "5"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", ">", "15"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, ">", 5] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, ">", 15] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", ">=", "5"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", ">=", "10"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            // 10
            inputs: { array: ["10", ">=", "19"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, ">=", 5] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, ">=", 10] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, ">=", 19] },
            params: {},
            result: {
                result: false,
            },
        },
        //
        {
            inputs: { array: ["10", "<", "5"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "<", "15"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, "<", 5] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, "<", 15] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "<=", "5"] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "<=", "10"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            // 20
            inputs: { array: ["10", "<=", "19"] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, "<=", 5] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, "<=", 10] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, "<=", 19] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, "||", false] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, "||", false] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, "&&", false] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, "&&", true] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, "XOR", false] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, "XOR", true] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, "XOR", false] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, "XOR", true] },
            params: {},
            result: {
                result: false,
            },
        },
        //
        {
            inputs: { array: [["aaa", "==", "aaa"], "||", ["aaa", "==", "bbb"]] },
            params: {},
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [["aaa", "==", "aaa"], "&&", ["aaa", "==", "bbb"]] },
            params: {},
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [[["aaa", "==", "aaa"], "&&", ["bbb", "==", "bbb"]], "||", ["aaa", "&&", "bbb"]] },
            params: {},
            result: {
                result: true,
            },
        },
        /// params.operator
        {
            inputs: { array: ["abc", "abc"] },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "a",
            },
        },
        {
            inputs: { array: ["abc", "abca"] },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "b",
            },
        },
        {
            inputs: { array: ["abc", "abc"] },
            params: { operator: "==" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["abc", "abcd"] },
            params: { operator: "==" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "abc"] },
            params: { operator: "!=" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["abc", "abcd"] },
            params: { operator: "!=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "5"] },
            params: { operator: ">" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "15"] },
            params: { operator: ">" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, 5] },
            params: { operator: ">" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 15] },
            params: { operator: ">" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "5"] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "10"] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: ["10", "19"] },
            params: { operator: ">=" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, 5] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 10] },
            params: { operator: ">=" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 19] },
            params: { operator: ">=" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "5"] },
            params: { operator: "<" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: ["10", "15"] },
            params: { operator: "<" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [10, 5] },
            params: { operator: "<" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [10, 15] },
            params: { operator: "<" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, false] },
            params: { operator: "||" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, false] },
            params: { operator: "||" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, false] },
            params: { operator: "&&" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, true] },
            params: { operator: "&&" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [true, false] },
            params: { operator: "XOR" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, true] },
            params: { operator: "XOR" },
            result: {
                result: true,
            },
        },
        {
            inputs: { array: [false, false] },
            params: { operator: "XOR" },
            result: {
                result: false,
            },
        },
        {
            inputs: { array: [true, true] },
            params: { operator: "XOR" },
            result: {
                result: false,
            },
        },
        /// left and right
        {
            inputs: { leftValue: "abc", rightValue: "abc" },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "a",
            },
        },
        {
            inputs: { leftValue: "abc", rightValue: "abca" },
            params: { value: { true: "a", false: "b" }, operator: "==" },
            result: {
                result: "b",
            },
        },
    ],
    description: "compare",
    category: ["compare"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/compare_agents/compare_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

// https://platform.openai.com/docs/guides/vision
const getImageUrl = (data, imageType, detail) => {
    if (imageType === "http") {
        return {
            url: data,
        };
    }
    const dataUrl = `data:image/${imageType};base64,${data}`;
    return {
        url: dataUrl,
        detail: detail ?? "auto",
    };
};
const images2messageAgent = async ({ namedInputs, params }) => {
    const { imageType, detail } = params;
    const { array, prompt } = namedInputs;
    arrayValidate("images2messageAgent", namedInputs);
    assert(!!imageType, "images2messageAgent: params.imageType is UNDEFINED! Set Type: png, jpg...");
    const contents = array.map((base64ImageData) => {
        const image_url = getImageUrl(base64ImageData, imageType, detail);
        return {
            type: "image_url",
            image_url,
        };
    });
    if (prompt) {
        contents.unshift({ type: "text", text: prompt });
    }
    return {
        message: {
            role: "user",
            content: contents,
        },
    };
};
const images2messageAgentInfo = {
    name: "images2messageAgent",
    agent: images2messageAgent,
    mock: images2messageAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "An array of base64-encoded image data strings or image URLs. These will be converted into OpenAI Vision-compatible image message format.",
                items: {
                    type: "string",
                    description: "Base64 image string or HTTP URL depending on 'imageType'.",
                },
            },
            prompt: {
                type: "string",
                description: "Optional prompt text to include as the first message content before images.",
            },
        },
        required: ["array"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            imageType: {
                type: "string",
                description: "The type of image input: 'png', 'jpg', etc. for base64, or 'http' for image URLs.",
            },
            detail: {
                type: "string",
                description: "The level of image detail requested by the model (e.g., 'auto', 'low', 'high'). Optional.",
            },
        },
        required: ["imageType"],
        additionalProperties: false,
    },
    output: {
        type: "object",
        properties: {
            message: {
                type: "object",
                description: "OpenAI-compatible chat message including images and optional prompt text.",
                properties: {
                    role: {
                        type: "string",
                        enum: ["user"],
                        description: "Message role, always 'user' for this agent.",
                    },
                    content: {
                        type: "array",
                        description: "The array of message content elements, including optional text and one or more images.",
                        items: {
                            type: "object",
                            oneOf: [
                                {
                                    properties: {
                                        type: {
                                            type: "string",
                                            const: "text",
                                        },
                                        text: {
                                            type: "string",
                                            description: "Prompt message text.",
                                        },
                                    },
                                    required: ["type", "text"],
                                    additionalProperties: false,
                                },
                                {
                                    properties: {
                                        type: {
                                            type: "string",
                                            const: "image_url",
                                        },
                                        image_url: {
                                            type: "object",
                                            properties: {
                                                url: {
                                                    type: "string",
                                                    description: "URL or data URL of the image.",
                                                },
                                                detail: {
                                                    type: "string",
                                                    description: "Image detail level (e.g., 'high', 'low', 'auto'). Optional for base64.",
                                                },
                                            },
                                            required: ["url"],
                                            additionalProperties: false,
                                        },
                                    },
                                    required: ["type", "image_url"],
                                    additionalProperties: false,
                                },
                            ],
                        },
                    },
                },
                required: ["role", "content"],
                additionalProperties: false,
            },
        },
        required: ["message"],
        additionalProperties: false,
    },
    samples: [
        {
            inputs: { array: ["abcabc", "122123"] },
            params: { imageType: "png" },
            result: {
                message: {
                    content: [
                        {
                            image_url: {
                                detail: "auto",
                                url: "data:image/png;base64,abcabc",
                            },
                            type: "image_url",
                        },
                        {
                            image_url: {
                                detail: "auto",
                                url: "data:image/png;base64,122123",
                            },
                            type: "image_url",
                        },
                    ],
                    role: "user",
                },
            },
        },
        {
            inputs: { array: ["abcabc", "122123"], prompt: "hello" },
            params: { imageType: "jpg", detail: "high" },
            result: {
                message: {
                    content: [
                        {
                            type: "text",
                            text: "hello",
                        },
                        {
                            image_url: {
                                detail: "high",
                                url: "data:image/jpg;base64,abcabc",
                            },
                            type: "image_url",
                        },
                        {
                            image_url: {
                                detail: "high",
                                url: "data:image/jpg;base64,122123",
                            },
                            type: "image_url",
                        },
                    ],
                    role: "user",
                },
            },
        },
        {
            inputs: { array: ["http://example.com/1.jpg", "http://example.com/2.jpg"] },
            params: { imageType: "http" },
            result: {
                message: {
                    content: [
                        {
                            image_url: {
                                url: "http://example.com/1.jpg",
                            },
                            type: "image_url",
                        },
                        {
                            image_url: {
                                url: "http://example.com/2.jpg",
                            },
                            type: "image_url",
                        },
                    ],
                    role: "user",
                },
            },
        },
    ],
    description: "Returns the message data for llm include image",
    category: ["image"],
    author: "Receptron team",
    repository: "https://github.com/snakajima/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/images_agents/image_to_message_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};

const defaultEmbeddingModel = "text-embedding-3-small";
const OpenAI_embedding_API = "https://api.openai.com/v1/embeddings";
// This agent retrieves embedding vectors for an array of strings using OpenAI's API
//
// Parameters:
//   model: Specifies the model (default is "text-embedding-3-small")
// NamedInputs:
//   array: Array<string>
//   item: string,
// Result:
//   contents: Array<Array<number>>
//
const stringEmbeddingsAgent = async ({ params, namedInputs, config, }) => {
    const { array, item } = namedInputs;
    const { apiKey, model, baseURL } = {
        ...(config || {}),
        ...params,
    };
    const url = baseURL ?? OpenAI_embedding_API;
    const theModel = model ?? defaultEmbeddingModel;
    const openAIKey = apiKey ?? process.env.OPENAI_API_KEY;
    const headers = {
        "Content-Type": "application/json",
        Authorization: openAIKey ? `Bearer ${openAIKey}` : "",
    };
    const sources = array ?? [item];
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
            input: sources,
            model: theModel,
        }),
    });
    const jsonResponse = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if ("data" in jsonResponse) {
        // maybe openAI
        return jsonResponse.data.map((object) => {
            return object.embedding;
        });
    }
    if ("embeddings" in jsonResponse) {
        // ollama
        return jsonResponse.embeddings;
    }
};
const stringEmbeddingsAgentInfo = {
    name: "stringEmbeddingsAgent",
    agent: stringEmbeddingsAgent,
    mock: stringEmbeddingsAgent,
    samples: [],
    description: "Embeddings Agent",
    category: ["embedding"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/embedding_agent.ts",
    package: "@graphai/vanilla",
    cacheType: "pureAgent",
    license: "MIT",
};

export { arrayFlatAgentInfo as arrayFlatAgent, arrayJoinAgentInfo as arrayJoinAgent, arrayToObjectAgentInfo as arrayToObjectAgent, compareAgentInfo as compareAgent, consoleAgentInfo as consoleAgent, copy2ArrayAgentInfo as copy2ArrayAgent, copyAgentInfo as copyAgent, copyMessageAgentInfo as copyMessageAgent, countingAgentInfo as countingAgent, dataSumTemplateAgentInfo as dataSumTemplateAgent, dotProductAgentInfo as dotProductAgent, echoAgentInfo as echoAgent, images2messageAgentInfo as images2messageAgent, jsonParserAgentInfo as jsonParserAgent, lookupDictionaryAgentInfo as lookupDictionaryAgent, mapAgentInfo as mapAgent, mergeNodeIdAgentInfo as mergeNodeIdAgent, mergeObjectAgentInfo as mergeObjectAgent, nestedAgentInfo as nestedAgent, popAgentInfo as popAgent, propertyFilterAgentInfo as propertyFilterAgent, pushAgentInfo as pushAgent, shiftAgentInfo as shiftAgent, sleeperAgentInfo as sleeperAgent, sortByValuesAgentInfo as sortByValuesAgent, streamMockAgentInfo as streamMockAgent, stringCaseVariantsAgentInfo as stringCaseVariantsAgent, stringEmbeddingsAgentInfo as stringEmbeddingsAgent, stringSplitterAgentInfo as stringSplitterAgent, stringTemplateAgentInfo as stringTemplateAgent, stringUpdateTextAgentInfo as stringUpdateTextAgent, totalAgentInfo as totalAgent, vanillaFetchAgentInfo as vanillaFetchAgent };
//# sourceMappingURL=bundle.esm.js.map
