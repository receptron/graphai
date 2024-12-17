import path from "path";
import { main } from "../src/agentdoc";

const npmRootPath = path.resolve(__dirname, "../../../llm_agents/openai_agent");
main(npmRootPath);
