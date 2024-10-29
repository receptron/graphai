import express from "express";
import * as agents from "@graphai/agents";

import { streamAgentFilterGenerator, agentFilterRunnerBuilder } from "@/index";
import { AgentFunctionContext, AgentFunctionInfoDictionary } from "graphai";

export const agentDispatcher = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params; // from url
  const { nodeId, retry, params: agentParams, inputs, namedInputs } = req.body; // post body
  const agentInfo = (agents as any)[agentId];
  const stream = agentParams?.stream || false;

  if (agentInfo === undefined) {
    return res.status(404).send({ message: "Agent not found" });
  }

  const context = {
    params: agentParams || {},
    inputs: inputs ?? [],
    namedInputs: namedInputs ?? {},
    debugInfo: {
      nodeId,
      retry,
      verbose: false,
    },
    filterParams: {},
    agents: agents as AgentFunctionInfoDictionary,
  };
  if (!stream) {
    const result = await agentInfo.agent(context);
    return res.json(result);
  }

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback = (context: AgentFunctionContext, token: string) => {
    if (token) {
      res.write(token);
    }
  };

  const agentFilters = [
    {
      name: "streamAgentFilter",
      agent: streamAgentFilterGenerator<string>(callback),
    },
  ];

  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(context, agentInfo.agent);

  // end of stream
  const json_data = JSON.stringify(result);
  res.write("___END___");
  res.write(json_data);
  return res.end();
};
