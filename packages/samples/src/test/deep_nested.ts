import "dotenv/config";

import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";

/*
  Tests with deep nesting graph. It works fine up to 400.
  If it is more than 500, a stack size error will occur.
  In that case, you can run it with options.
  node --stack-size=10000 -r ts-node/register src/deep_nested.ts
*/
const nestedDepth = 400;

const getDeepNestedGraph = () => {
  const copy = {
    version: 0.5,
    nodes: {
      nested: {
        agent: "copyAgent",
        inputs: {item: ":count"},
        isResult: true,
      },
    },
  };
  const getNestedGraph = (graph: any) => {
    const nested = {
      version: 0.5,
      nodes: {
        nested: {
          agent: "nestedAgent",
          isResult: true,
          inputs: {
            count: ":count",
          },
          graph: graph,
        },
      },
    };
    return nested;
  };

  const loop = () => {
    let tmp: any = copy;
    for (let i = 0; i < nestedDepth; i++) {
      tmp = getNestedGraph(tmp);
    }
    return tmp;
  };

  const base = {
    version: 0.5,
    nodes: {
      count: {
        value: 1,
      },
      nested: {
        agent: "nestedAgent",
        isResult: true,
        inputs: {
          count: ":count",
        },
        graph: loop(),
      },
    },
  };
  return base;
};

export const main = async () => {
  const graph_data = getDeepNestedGraph();
  // const result = await graphDataTestRunner(__filename, graph_data, { openAIAgent }, { agentFilters });
  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  console.log(JSON.stringify(result));

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
