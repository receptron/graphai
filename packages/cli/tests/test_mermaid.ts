import { mermaid } from "../src/mermaid";
import { type GraphData } from "graphai";
import test from "node:test";
import assert from "node:assert";

const captureConsoleOutput = (fn: () => void): string => {
  const originalLog = console.log;
  const output: string[] = [];
  console.log = (message: string) => output.push(message);
  
  try {
    fn();
    return output.join("\n");
  } finally {
    console.log = originalLog;
  }
};

const assertOutputContains = (output: string, expectedStrings: string[]): void => {
  expectedStrings.forEach(expected => {
    assert(output.includes(expected), `Expected output to contain: "${expected}"`);
  });
};

test("test mermaid with simple graph", async () => {
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      message: {
        value: "Hello World",
      },
      echo: {
        agent: "echoAgent",
        inputs: { text: ":message" },
      },
    },
  };

  const output = captureConsoleOutput(() => mermaid(graphData));

  assertOutputContains(output, [
    "flowchart TD",
    "  n_message(message)",
    "  n_echo(echo<br/>echoAgent)",
    "  n_message --> n_echo",
    "  class n_message staticNode",
    "  class n_echo computedNode"
  ]);
});

test("test mermaid with nested graph", async () => {
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      outer: {
        agent: "nestedAgent",
        graph: {
          nodes: {
            inner1: {
              value: "Inner Value 1",
            },
            inner2: {
              agent: "copyAgent",
              inputs: { text: ":inner1" },
            },
          },
        },
      },
    },
  };

  const output = captureConsoleOutput(() => mermaid(graphData));

  assertOutputContains(output, [
    "flowchart TD",
    "  subgraph n_outer[outer: nestedAgent]",
    "    n_outer_inner1(inner1)",
    "    n_outer_inner2(inner2<br/>copyAgent)",
    "    n_outer_inner1 --> n_outer_inner2",
    "  end",
    "  class n_outer nestedGraph",
    "  class n_outer_inner1 staticNode",
    "  class n_outer_inner2 computedNode"
  ]);
});

test("test mermaid with connections and properties", async () => {
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      data: {
        value: {
          name: "John",
          age: 30,
        },
      },
      getName: {
        agent: "copyAgent",
        inputs: { text: ":data.name" },
      },
      getAge: {
        agent: "copyAgent",
        inputs: { text: ":data.age" },
      },
    },
  };

  const output = captureConsoleOutput(() => mermaid(graphData));

  assertOutputContains(output, [
    "flowchart TD",
    "  n_data(data)",
    "  n_getName(getName<br/>copyAgent)",
    "  n_getAge(getAge<br/>copyAgent)",
    "  n_data -- name --> n_getName",
    "  n_data -- age --> n_getAge",
    "  class n_data staticNode",
    "  class n_getName,n_getAge computedNode"
  ]);
});

test("test mermaid with update connections", async () => {
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      counter: {
        value: 0,
        update: ":increment",
      },
      increment: {
        agent: "incrementAgent",
        inputs: { value: ":counter" },
      },
    },
  };

  const output = captureConsoleOutput(() => mermaid(graphData));

  assertOutputContains(output, [
    "flowchart TD",
    "  n_counter(counter)",
    "  n_increment(increment<br/>incrementAgent)",
    "  n_counter --> n_increment",
    "  n_increment --> n_counter",
    "  class n_counter staticNode",
    "  class n_increment computedNode"
  ]);
});

test("test mermaid with deeply nested graph", async () => {
  const graphData: GraphData = {
    version: 0.5,
    nodes: {
      level1: {
        agent: "nestedAgent",
        graph: {
          nodes: {
            level2: {
              agent: "nestedAgent",
              graph: {
                nodes: {
                  level3: {
                    value: "Deep value",
                  },
                  processor: {
                    agent: "processAgent",
                    inputs: { data: ":level3" },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const output = captureConsoleOutput(() => mermaid(graphData));

  assertOutputContains(output, [
    "flowchart TD",
    "  subgraph n_level1[level1: nestedAgent]",
    "    subgraph n_level1_level2[level2: nestedAgent]",
    "      n_level1_level2_level3(level3)",
    "      n_level1_level2_processor(processor<br/>processAgent)",
    "      n_level1_level2_level3 --> n_level1_level2_processor",
    "    end",
    "  end"
  ]);
});

test("test mermaid with empty graph", async () => {
  const graphData: GraphData = {
    version: 0.5,
    nodes: {},
  };

  const output = captureConsoleOutput(() => mermaid(graphData));

  assert.strictEqual(output, "flowchart TD");
});