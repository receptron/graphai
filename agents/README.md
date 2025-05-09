# GraphAI Agents

This directory contains agents that provide the core functionality of GraphAI.

For general-purpose agents, please refer to:
https://github.com/receptron/graphai-agents

Below is a brief overview of the agents in this directory:

- vanilla_agents
  - A collection of agents that do not depend on any npm packages outside of GraphAI-related ones.
  - The name "vanilla agents" is derived from Vanilla JS.

- llm_agent
  - A meta-package for LLM-related agents. The main implementation is located here.

- The meta-package that bundles the agents in this directory is located here.
  - https://github.com/receptron/graphai/tree/main/packages/agents

## Do not create PRs for agents in this monorepo.

General-purpose agents should be developed in personal repositories.

If you wish to contribute, please create a pull request at:
https://github.com/receptron/graphai-agents
