"use strict";
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
