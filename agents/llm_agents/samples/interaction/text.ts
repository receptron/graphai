import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as llm_agents from "@/index";
import * as agents from "@graphai/agents";

const graph_data = {
  version: 0.3,
  loop: {
    count: 3,
  },
  nodes: {
    node1: {
      value: {},
      update: ":node3",
    },
    node2: {
      agent: "textInputAgent",
    },
    node2ToObj: {
      agent: "propertyFilterAgent",
      params: { inject: [{ propId: "answer", from: 0 }], include: [] },
      inputs: [":node2"],
    },
    node3: {
      inputs: [":node1", ":node2ToObj"],
      agent: "mergeNodeIdAgent",
    },
  },
};

export const main = async () => {
  graph_data.nodes.node1.value = { injected: "test" };

  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents, ...llm_agents });
  console.log(result);

  console.log("COMPLETE 1");
};

if (process.argv[1] === __filename) {
  main();
}
