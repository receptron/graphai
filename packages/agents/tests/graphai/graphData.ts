// test_source_prop.ts

export const graphDataLiteral = {
  version: 0.5,
  nodes: {
    source: {
      value: "apple",
    },
    source2: {
      value: { apple: "red" },
    },
    step1: {
      agent: "stringTemplateAgent",
      params: {
        template: "${a}, ${b}, ${c}.",
      },
      inputs: { a: ":source", b: "orange", c: undefined },
      isResult: true,
    },
    step2: {
      agent: "sleepAndMergeAgent",
      inputs: { array: [":source2", { lemon: "yellow" }] },
      isResult: true,
    },
  },
};

// test_inputs.ts
export const graphDataInputs = {
  version: 0.5,
  nodes: {
    apple: {
      value: { fruits: { apple: "red" } },
    },
    lemon: {
      value: { fruits: { lemon: "yellow" } },
    },
    total: {
      agent: "sleepAndMergeAgent",
      inputs: { array: [":apple", ":lemon", ":apple.fruits", ":lemon.fruits"] },
    },
  },
};

// test_any.ts
export const graphDataAny = {
  version: 0.5,
  nodes: {
    source: {
      value: {},
    },
    positive: {
      agent: "sleepAndMergeAgent",
      anyInput: true,
      isResult: true,
      inputs: { array: [":source.yes"] },
    },
    negative: {
      agent: "sleepAndMergeAgent",
      anyInput: true,
      isResult: true,
      inputs: { array: [":source.no"] },
    },
  },
};

export const graphDataAny2 = {
  version: 0.5,
  nodes: {
    source1: {
      value: { apple: "red" },
    },
    source2: {
      value: { lemon: "yellow" },
    },
    router1: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 10,
      },
      isResult: true,
      inputs: { array: [":source1"] },
    },
    router2: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 100,
      },
      isResult: true,
      inputs: { array: [":source2"] },
    },
    receiver: {
      agent: "sleepAndMergeAgent",
      anyInput: true,
      isResult: true,
      inputs: { array: [":router1", ":router2"] },
    },
  },
};

// test_nest.ts
export const validChildGraph = {
  nodes: {
    source: {
      value: 1,
    },
    result: {
      agent: "copyAgent",
      inputs: { source: ":source" },
      isResult: true,
    },
  },
};

export const graphDataNested = {
  version: 0.5,
  nodes: {
    source: {
      value: validChildGraph,
    },
    nested: {
      agent: "nestedAgent",
      graph: ":source",
      isResult: true,
    },
    catch: {
      agent: "propertyFilterAgent",
      params: {
        include: ["message"],
      },
      if: ":nested.onError",
      inputs: { item: ":nested.onError" },
      isResult: true,
    },
  },
};
