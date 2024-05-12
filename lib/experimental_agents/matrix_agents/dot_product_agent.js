"use strict";
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
    category: [],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = dotProductAgentInfo;
