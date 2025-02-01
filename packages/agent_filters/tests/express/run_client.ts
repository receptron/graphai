// run server:
//     yarn run http_server
// run test:
//     npx ts-node -r tsconfig-paths/register tests/express/run_client.ts
//

import { httpAgentFilter } from "@/index";
import { GraphAI, GraphData, graphDataLatestVersion } from "graphai";
import * as agents from "@graphai/agents";

const graph_data: GraphData = {
  version: graphDataLatestVersion,
  nodes: {
    message: {
      value: "Hello World",
    },
    copy: {
      agent: "copyAgent",
      inputs: {
        text: ":message",
      },
      console: true,
    },
  },
};

const main = async () => {
  const serverAgents = ["copyAgent"];
  const agentFilters = [
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      filterParams: {
        server: {
          baseUrl: "http://localhost:8085/agents",
        },
      },
      agentIds: serverAgents,
    },
  ];
  const graph = new GraphAI(graph_data, agents, { agentFilters, config: { copyAgent: { headers: { "test-header": "from graphai config" } } } });
  const result = await graph.run(true);
  console.log(result);
};

const main2 = async () => {
  const serverAgents = ["copyAgent"];
  const agentFilters = [
    {
      name: "httpAgentFilter",
      agent: httpAgentFilter,
      filterParams: {
        server: {
          baseUrl: "http://localhost:8085/agents",
        },
      },
      agentIds: serverAgents,
    },
  ];
  const graph = new GraphAI(graph_data, agents, { agentFilters, config: { global: { headers: { "test-header": "from graphai config" } } } });
  const result = await graph.run(true);
  console.log(result);
};

main();
main2();
