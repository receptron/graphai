import { AgentFunction } from "graphai";

// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  inputs[0]: Two dimentional array of numbers.
//  inputs[1]: One dimentional array of numbers.
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
export const dotProductAgent: AgentFunction<
  Record<never, never>,
  Array<number>,
  Array<Array<number>> | Array<number>
> = async ({ inputs }) => {
  const embeddings: Array<Array<number>> = inputs[0] as Array<Array<number>>;
  const reference: Array<number> = inputs[1] as Array<number>;
  if (embeddings[0].length != reference.length) {
    throw new Error(
      `dotProduct: Length of vectors do not match. ${embeddings[0].length}, ${reference.length}`,
    );
  }
  const contents = embeddings.map((embedding) => {
    return embedding.reduce((dotProduct: number, value, index) => {
      return dotProduct + value * reference[index];
    }, 0);
  });
  return contents;
};

const dotProductAgentInfo = {
  name: "dotProductAgent",
  agent: dotProductAgent,
  mock: dotProductAgent,
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
export default dotProductAgentInfo;
