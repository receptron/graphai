// This file adds agents that runs in pure JavaScript without any external npm modules.

// Please refrain from adding agents that require npm. Those should be added to the index.ts.

export * from "./string_agents";
export * from "./array_agents";
export * from "./matrix_agents";
export * from "./test_agents";
export * from "./graph_agents";
export * from "./data_agents";
export * from "./service_agents";

import stringEmbeddingsAgent from "./embedding_agent";

export { stringEmbeddingsAgent };
