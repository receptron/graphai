//  npx ts-node samples/express.ts
import { GraphAI, AgentFunction } from "../src/graphai";

import express from "express";

const app = express();

const graphAISample = async (req: express.Request, res: express.Response) => {
  const graph_data = {
    nodes: {
      node1: {
        params: {},
      },
    },
    concurrency: 8,
  };
  const testFunction: AgentFunction<Record<string, string>> = async (context) => {
    console.log("hello");
    return {};
  };
  const graph = new GraphAI(graph_data, testFunction);
  const response = await graph.run();
  res.json({ result: response });
  res.end();
};

const hello = async (req: express.Request, res: express.Response) => {
  const { params, query } = req;
  res.json({
    result: [
      {
        message: "hello",
        params,
        query,
      },
    ],
  });
  res.end();
};

app.use(express.json());
app.get("/", hello);
app.get("/mock", graphAISample);

const server = app.listen(8080, () => {
  console.log("Running Server");
});
