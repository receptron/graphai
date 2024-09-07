import { writeGraphExample } from "@receptron/agentdoc";
import { graphdata, graphdata2, graphdata3 } from "./graphData";

writeGraphExample({ graphdata, graphdata2, graphdata3 }, __dirname + "/../../docs/");
