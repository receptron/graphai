export const graphDataGroqMath = {
  version: 0.5,
  nodes: {
    inputData: {
      value: "hello, let me know the answer 1 + 1",
    },
    llm: {
      agent: "groqAgent",
      inputs: {
        prompt: ":inputData",
      },
      params: {
        model: "llama3-8b-8192",
      },
    },
  },
};
