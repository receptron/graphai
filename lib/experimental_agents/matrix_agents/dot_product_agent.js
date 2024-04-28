"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotProductAgent = void 0;
// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  inputs[0]: Two dimentional array of numbers.
//  inputs[1]: Two dimentional array of numbers (but the array size is 1 for the first dimention)
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
const dotProductAgent = async ({ inputs }) => {
    const embeddings = inputs[0];
    const reference = inputs[1][0];
    if (embeddings[0].length != reference.length) {
        throw new Error("dotProduct: Length of vectors do not match.");
    }
    const contents = embeddings.map((embedding) => {
        return embedding.reduce((dotProduct, value, index) => {
            return dotProduct + value * reference[index];
        }, 0);
    });
    return { contents };
};
exports.dotProductAgent = dotProductAgent;
const dotProductAgentInfo = {
    name: "dotProductAgent",
    agent: exports.dotProductAgent,
    mock: exports.dotProductAgent,
    samples: [],
    description: "dotProduct Agent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = dotProductAgentInfo;
