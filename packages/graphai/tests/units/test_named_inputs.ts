import { GraphAI } from "@/index";
import { graphDataLatestVersion } from "~/common";

import * as agents from "~/test_agents";

import test from "node:test";
import assert from "node:assert";

const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    result: {
      agent: (input: string) => input,
      inputs: [":message"],
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: ":message" },
      isResult: true,
    },
  },
};

const graph_data_array_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    result: {
      agent: (input: string) => input,
      inputs: [":message"],
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [":message", ":message2"] },
      isResult: true,
    },
  },
};

const graph_data_nested_array_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    result: {
      agent: (input: string) => input,
      inputs: [":message"],
      isResult: true,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [[[":message"], ":message2"]] },
      isResult: true,
    },
  },
};

const graph_data_nested_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: { nested: ":message", deep: { nested: [":message2", { nested: ":message", array: [":message"] }] } } },
      isResult: true,
    },
  },
};

const graph_data_any_named_inputs = {
  version: 0.5,
  nodes: {
    no_tool_calls: {
      value: [],
    },
    tool_calls: {
      value: [1, 1],
    },
    reducer: {
      agent: "bypassAgent",
      anyInput: true,
      isResult: true,
      inputs: {
        array: [":no_tool_calls", ":tool_calls"],
      },
    },
  },
};

const graph_data_any_named_inputs2 = {
  version: 0.5,
  nodes: {
    no_tool_calls: {
      value: undefined,
    },
    tool_calls: {
      value: [1, 1],
    },
    reducer: {
      agent: "bypassAgent",
      anyInput: true,
      isResult: true,
      inputs: {
        array: [":no_tool_calls", ":tool_calls"],
      },
    },
  },
};

const graph_data_deep_nested_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [[[":message"], ":message2", { array: [":message", { item: ":message" }] }]] },
      isResult: true,
    },
  },
};

const graph_data_template_nested_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: "Hello World2",
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [[["hi ${:message} !"], ":message2", { array: [":message", { item: "${:message} ${:message2}" }] }]] },
      isResult: true,
    },
  },
};

const graph_data_deep_and_any_nested_named_input = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    message2: {
      value: undefined,
    },
    namedResult: {
      agent: (object: { input: string }) => object.input,
      inputs: { input: [{ array: [":message", { item: ":message", item2: ":message2" }] }] },
      anyInput: true,
      isResult: true,
    },
  },
};

test("test named inputs", async () => {
  const graph = new GraphAI(graph_data, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: "Hello World" });
});

test("test named inputs array", async () => {
  const graph = new GraphAI(graph_data_array_named_input, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: ["Hello World", "Hello World2"] });
});

test("test nested named inputs array", async () => {
  const graph = new GraphAI(graph_data_nested_array_named_input, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { result: "Hello World", namedResult: [[["Hello World"], "Hello World2"]] });
});

test("test nested named inputs", async () => {
  const graph = new GraphAI(graph_data_nested_named_input, {}, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    namedResult: { nested: "Hello World", deep: { nested: ["Hello World2", { nested: "Hello World", array: ["Hello World"] }] } },
  });
});

test("test anyinput named inputs", async () => {
  const graph = new GraphAI(graph_data_any_named_inputs, agents, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { reducer: { array: [[], [1, 1]] } });
});

test("test anyinput named inputs2", async () => {
  const graph = new GraphAI(graph_data_any_named_inputs2, agents, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { reducer: { array: [[1, 1]] } });
});

test("test deep named inputs", async () => {
  const graph = new GraphAI(graph_data_deep_nested_named_input, agents, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { namedResult: [[["Hello World"], "Hello World2", { array: ["Hello World", { item: "Hello World" }] }]] });
});

test("test template named inputs", async () => {
  const graph = new GraphAI(graph_data_template_nested_named_input, agents, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { namedResult: [[["hi Hello World !"], "Hello World2", { array: ["Hello World", { item: "Hello World Hello World2" }] }]] });
});

test("test deep named inputs", async () => {
  const graph = new GraphAI(graph_data_deep_and_any_nested_named_input, agents, {});
  const result = await graph.run();
  assert.deepStrictEqual(result, { namedResult: [{ array: ["Hello World", { item: "Hello World" }] }] });
});
