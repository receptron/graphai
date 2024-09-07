import { writeGraphExample } from "@receptron/agentdoc";
import { graphDataFetch, graphDataPost } from "./graphData";

writeGraphExample({ graphDataFetch, graphDataPost }, __dirname + "/../docs/");
