import { AgentFunction } from "@/graphai";

// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  inputs[0]: Two dimentional array of numbers.
//  inputs[1]: Two dimentional array of numbers (but the array size is 1 for the first dimention)
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
export const dotProductAgent: AgentFunction<
  {},
  {
    contents: Array<number>;
  },
  Array<Array<number>>
> = async ({ params, inputs }) => {
  const embeddings: Array<Array<number>> = inputs[0];
  const reference: Array<number> = inputs[1][0];
  if (embeddings[0].length != reference.length) {
    throw new Error("dotProduct: Length of vectors do not match.");
  }
  const contents = embeddings.map((embedding) => {
    return embedding.reduce((dotProduct: number, value, index) => {
      return dotProduct + value * reference[index];
    }, 0);
  });
  return { contents };
};

// This agent returned a sorted array of one array (A) based on another array (B).
// The default sorting order is "decendant".
//
// Parameters:
//  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
// Inputs:
//  inputs[0]: Array<any>; // array to be sorted
//  inputs[1]: Array<number>; // array of numbers for sorting
//
export const sortByValuesAgent: AgentFunction<
  {
    assendant?: boolean;
  },
  {
    contents: Array<any>;
  },
  Array<any>
> = async ({ params, inputs }) => {
  const direction = params?.assendant ?? false ? -1 : 1;
  const sources: Array<any> = inputs[0];
  const values: Array<any> = inputs[1];
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
