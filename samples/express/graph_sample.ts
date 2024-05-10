import express from "express";
import { GraphAI, AgentFunction } from "@/graphai";

export const graphAISample = async (req: express.Request, res: express.Response) => {
  const graph_data = {
    nodes: {
      node1: {
        agent: "testFunction",
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
