// This file adds agents that runs in pure JavaScript without any external npm modules.

// Please refrain from adding agents that require npm. Those should be added to the index.ts.

export * from "./string_agents/vanilla";
export * from "./array_agents/vanilla";
export * from "./matrix_agents/vanilla";
export * from "./test_agents/vanilla";
export * from "./graph_agents/vanilla";
export * from "./data_agents/vanilla";

import functionAgent from "./function_agent";
import stringEmbeddingsAgent from "./embedding_agent";

export { functionAgent, stringEmbeddingsAgent };
