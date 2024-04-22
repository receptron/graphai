"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByValuesAgent = exports.dotProductAgent = void 0;
// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Parameters:
//  inputKey: string; // specifies the property to retrieve from inputs. The default is "contents"
// Inputs:
//  inputs[0].inputKey: Two dimentional array of numbers.
//  inputs[1].inputKey: Two dimentional array of numbers (but the array size is 1 for the first dimention)
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
const dotProductAgent = async ({ params, inputs }) => {
    const embeddings = inputs[0][params.inputKey ?? "contents"];
    const reference = inputs[1][params.inputKey ?? "contents"][0];
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
// This agent returned a sorted array of one array (A) based on another array (B).
// The default sorting order is "decendant".
//
// Parameters:
//  inputKey: Specifies the property to get those arrays from inputs. The default is "contents".
//  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
// Inputs:
//  inputs[0].inputKey: Array<any>; // array to be sorted
//  inputs[1].inputKey: Array<number>; // array of numbers for sorting
//
const sortByValuesAgent = async ({ params, inputs }) => {
    const direction = params?.assendant ?? false ? -1 : 1;
    const sources = inputs[0][params.inputKey ?? "contents"];
    const values = inputs[1][params.inputKey ?? "contents"];
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
    return { contents };
};
exports.sortByValuesAgent = sortByValuesAgent;
