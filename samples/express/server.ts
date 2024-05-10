// npx ts-node samples/express.ts
// sample client: samples/curl.sh

import { hello } from "./hello";
import { graphAISample } from "./graph_sample";
import { agentDispatcher } from "./agent_dispatcher";

import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:8080"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(express.json());
app.use(cors(options));

app.use(express.json());
app.get("/", hello);
app.get("/mock", graphAISample);

app.post("/agents/:agentId", agentDispatcher);

const port = 8085;
app.listen(port, () => {
  console.log("Running Server at " + port);
});
