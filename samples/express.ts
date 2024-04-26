// npx ts-node samples/express.ts
// sample client: samples/curl.sh
import { GraphAI, AgentFunction } from "@/graphai";
import { defaultTestAgents } from "~/agents/agents";

import express from "express";

const app = express();
app.use(express.json());

const graphAISample = async (req: express.Request, res: express.Response) => {
  const graph_data = {
    nodes: {
      node1: {
        agentId: "testFunction",
        params: {},
      },
    },
    concurrency: 8,
  };
  const testFunction: AgentFunction<Record<string, string>> = async () => {
    console.log("hello");
    return {};
  };
  const graph = new GraphAI(graph_data, { testFunction });
  const response = await graph.run(true);
  res.json({ result: response });
  res.end();
};

const hello = async (req: express.Request, res: express.Response) => {
  // const { params, query } = req;
  res.json({
    message: "hello",
  });
  res.end();
};

const agentDispatcher = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params;
  const { nodeId, retry, params: agentParams, inputs, forkIndex } = req.body;
  const agent = defaultTestAgents[agentId];
  const result = await agent({
    params: agentParams,
    inputs,
    debugInfo: {
      nodeId,
      retry,
      forkIndex,
      verbose: false,
    },
    agents: defaultTestAgents,
  });
  res.json(result);
};

app.use(express.json());
app.get("/", hello);
app.get("/mock", graphAISample);

app.post("/agents/:agentId", agentDispatcher);

const port = 8085;
app.listen(port, () => {
  console.log("Running Server at " + port);
});
