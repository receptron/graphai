import { AgentFunction } from "@/graphai";

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
  const contents = embeddings.map((embedding) => {
    return embedding.reduce((dotProduct: number, value, index) => {
      return dotProduct + value * reference[index];
    }, 0);
  });
  return { contents };
};
