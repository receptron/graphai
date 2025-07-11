"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotProductAgent = void 0;
const graphai_1 = require("graphai");
// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  matrix: Two dimentional array of numbers.
//  vector: One dimentional array of numbers.
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
const dotProductAgent = async ({ namedInputs, }) => {
    (0, graphai_1.assert)(!!namedInputs, "dotProductAgent: namedInputs is UNDEFINED!");
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
exports.dotProductAgent = dotProductAgent;
const dotProductAgentInfo = {
    name: "dotProductAgent",
    agent: exports.dotProductAgent,
    mock: exports.dotProductAgent,
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
exports.default = dotProductAgentInfo;
