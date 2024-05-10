// npx ts-node samples/express.ts
// sample client: samples/curl.sh
import { defaultTestAgents } from "@/utils/test_agents";
import { hello } from "./express/hello";
import { graphAISample } from "./express/graph_sample";

import express from "express";

const app = express();
app.use(express.json());



const agentDispatcher = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const { agentId } = params;
  const { nodeId, retry, params: agentParams, inputs } = req.body;
  const agent = defaultTestAgents[agentId];
  const result = await agent({
    params: agentParams || {},
    inputs,
    debugInfo: {
      nodeId,
      retry,
      verbose: false,
    },
    filterParams: {},
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
