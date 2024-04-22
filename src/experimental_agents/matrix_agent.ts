import { AgentFunction } from "@/graphai";

// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Parameters:
//  inputKey: string; // specifies the property to retrieve from inputs. The default is "contents"
// Inputs:
//  inputs[0].inputKey: Two dimentional array of numbers.
//  inputs[1].inputKey: Two dimentional array of numbers (but the array size is 1 for the first dimention)
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
export const dotProductAgent: AgentFunction<
  {
    inputKey?: string;
  },
  {
    contents: Array<number>;
  }
> = async ({ params, inputs }) => {
  const embeddings: Array<Array<number>> = inputs[0][params.inputKey ?? "contents"];
  const reference: Array<number> = inputs[1][params.inputKey ?? "contents"][0];
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
