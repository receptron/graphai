'use strict';

var require$$0 = require('graphai');
var fs = require('fs');

var lib = {};

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.arrayValidate = exports.isNamedInputs = exports.sample2GraphData = void 0;
		const graphai_1 = require$$0;
		const sample2GraphData = (sample, agentName) => {
		    const nodes = {};
		    const inputs = (() => {
		        if (Array.isArray(sample.inputs)) {
		            Array.from(sample.inputs.keys()).forEach((key) => {
		                nodes["sampleInput" + key] = {
		                    value: sample.inputs[key],
		                };
		            });
		            return Object.keys(nodes).map((k) => ":" + k);
		        }
		        nodes["sampleInput"] = {
		            value: sample.inputs,
		        };
		        return Object.keys(sample.inputs).reduce((tmp, key) => {
		            tmp[key] = `:sampleInput.` + key;
		            return tmp;
		        }, {});
		    })();
		    nodes["node"] = {
		        isResult: true,
		        agent: agentName,
		        params: sample.params,
		        inputs: inputs,
		        graph: sample.graph,
		    };
		    const graphData = {
		        version: 0.5,
		        nodes,
		    };
		    return graphData;
		};
		exports.sample2GraphData = sample2GraphData;
		const isNamedInputs = (namedInputs) => {
		    return Object.keys(namedInputs || {}).length > 0;
		};
		exports.isNamedInputs = isNamedInputs;
		const arrayValidate = (agentName, namedInputs, extra_message = "") => {
		    (0, graphai_1.assert)((0, exports.isNamedInputs)(namedInputs), `${agentName}: namedInputs is UNDEFINED!` + extra_message);
		    (0, graphai_1.assert)(!!namedInputs.array, `${agentName}: namedInputs.array is UNDEFINED!` + extra_message);
		    (0, graphai_1.assert)(Array.isArray(namedInputs.array), `${agentName}: namedInputs.array is not Array.` + extra_message);
		};
		exports.arrayValidate = arrayValidate; 
	} (lib));
	return lib;
}

var libExports = requireLib();

const fileReadAgent = async ({ namedInputs, params }) => {
    const { basePath, outputType } = params;
    libExports.arrayValidate("fileReadAgent", namedInputs);
    require$$0.assert(!!basePath, "fileReadAgent: params.basePath is UNDEFINED!");
    const files = namedInputs.array.map((file) => {
        const path = basePath + file;
        const buffer = fs.readFileSync(path);
        if (outputType && outputType === "base64") {
            return buffer.toString("base64");
        }
        if (outputType && outputType === "text") {
            return new TextDecoder().decode(buffer);
        }
        return buffer;
    });
    return {
        array: files,
    };
};
const fileReadAgentInfo = {
    name: "fileReadAgent",
    agent: fileReadAgent,
    mock: fileReadAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "file names",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: ["test.txt"] },
            params: { basePath: __dirname + "/../../tests/files/" },
            result: {
                array: [Buffer.from([104, 101, 108, 108, 111, 10])],
            },
        },
        {
            inputs: { array: ["test.txt"] },
            params: { basePath: __dirname + "/../../tests/files/", outputType: "base64" },
            result: {
                array: ["aGVsbG8K"],
            },
        },
        {
            inputs: { array: ["test.txt"] },
            params: { basePath: __dirname + "/../../tests/files/", outputType: "text" },
            result: {
                array: ["hello\n"],
            },
        },
    ],
    description: "Read data from file system and returns data",
    category: ["fs"],
    author: "Receptron team",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};

exports.fileReadAgent = fileReadAgentInfo;
//# sourceMappingURL=bundle.cjs.js.map
