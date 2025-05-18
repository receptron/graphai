import { GraphAI } from "graphai";
import * as agents from "@graphai/vanilla";
import { stepRunner } from "../../src/filters/step_runner_console";

const graph_data = {
  version: 0.5,
  loop: {
    count: 3,
  },
  nodes: {
    node1: {
      agent: "copyAgent",
      inputs: {
        message: "hello",
      },
      // console: { after: true },
    },
    node2: {
      agent: "copyAgent",
      inputs: {
        message: ":node1.message",
      },
      // console: { after: true },
    },
    nested: {
      agent: "nestedAgent",
      inputs: {
        data: ":node2.message",
      },
      graph: {
        version: 0.5,
        nodes: {
          nestedNode1: {
            agent: "copyAgent",
            inputs: {
              message: ":data",
            },
          },
        },
      },
    },
  },
};
const main = async () => {
  const agentFilters = [
    {
      name: "stepRunner",
      agent: stepRunner,
    },
  ];

  const graph = new GraphAI(
    graph_data,
    {
      ...agents,
    },
    { agentFilters },
  );
  await graph.run();
};

main();
