// npx ts-node samples/express.ts
// sample client: samples/curl.sh
import { defaultTestAgents } from "@/utils/test_agents";
import { hello } from "./express/hello";
import { graphAISample } from "./express/graph_sample";

import { streamAgentFilterGenerator } from "@/experimental_agent_filters/stream";
import { agentFilterRunnerBuilder } from "@/utils/test_utils";

import { AgentFunctionContext } from "@/type";

import express from "express";
import cors from "cors";


const app = express();

const allowedOrigins = ["http://localhost:8080"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(express.json());
app.use(cors(options));

const agentDispatcher = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params; // from url
  const { nodeId, retry, params: agentParams, inputs } = req.body; // post body
  const agent = defaultTestAgents[agentId];
  const isStreaming  = agentParams.isStreaming || false;

  if (agent === undefined) {
    return res.status(404).send({ message: "Agent not found" });
  }
  
  const context = {
    params: agentParams || {},
    inputs,
    debugInfo: {
      nodeId,
      retry,
      verbose: false,
    },
    filterParams: {},
    agents: defaultTestAgents,
  };
  if (!isStreaming) {
    const result = await agent(context);
    return res.json(result);
  }

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback = (context: AgentFunctionContext, token: string) => {
    if (token) {
      res.write(token)
    }
  };

  const agentFilters = [
    {
      name: "streamAgentFilter",
      agent: streamAgentFilterGenerator<string>(callback),
    },
  ];

  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(context, agent);

  // end of stream
  const json_data = JSON.stringify(result);
  res.write("___END___");
  res.write(json_data);
  return res.end();
  
};

app.use(express.json());
app.get("/", hello);
app.get("/mock", graphAISample);

app.post("/agents/:agentId", agentDispatcher);

const port = 8085;
app.listen(port, () => {
  console.log("Running Server at " + port);
});
