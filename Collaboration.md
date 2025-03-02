## Collaboration

Step 1. Install **Git**, **Node.js (>=20.x)**, and **Yarn**.

Step 2. Clone the project and install necessary node modules

```
git clone git@github.com:receptron/graphai.git
yarn install
```

Step 3. Set the environment variable OPENAI_API_KEY to your own key (=sk-...)

You need to set ANTHROPIC_API_KEY as well, if you want to use Claude.

Step 4. Run the test script

Run the test

```
yarn run test
```

Step 5. Run one of sample scripts

```
cd packages/samples/
yarn run sample ./src/tools/home.ts
```

Step 6. Write some code and send pull requests

- Please run "yarn run format" before sending your pull request.
- Please do not include any build files (files under /lib) to your pull reuquest.

Key principles:

1. Keep the core (Node and GraphAI classes) small and simple.
2. Enhance the platform by adding 'agents' (plug ins).
3. Simple but effective test scripts make it easy to maintain.


## 🔄 Pull Request Guidelines
- Base your PR on the main branch.
- Keep PRs small and focused (one feature or fix per PR).
- Add clear descriptions for changes.

## 🧹 Code Style

- Follow ESLint and Prettier rules.
- Do not use `any`.
- Avoid using `let`; prefer `const` whenever possible.
- Minimize type casting as much as possible.

## 🔀 Git Workflow

- Do not use `--force`; progress with `merge`.
- In a monorepo setup, add only necessary npm dependencies to each package.
  All other dependencies should be added to the root `package.json`.


# GraphAI Repository

This repository includes the core of GraphAI and the tools provided as its basic functionality.

Agents and tools can be found in the following repositories. Please refer to them.  
For pull requests regarding new Agents, please submit them to the appropriate repository below.

## General Agents  
[GraphAI Agents](https://github.com/receptron/graphai-agents)

## Other Tools  
Includes Express, Cytoscape, and various specialized agents/tools.  
[GraphAI Utils](https://github.com/receptron/graphai-utils/)

## GraphAI Demo for the Web  
[GraphAI Demo Web](https://github.com/receptron/graphai-demo-web)

## GraphAI GUI Tool  
[Grapys](https://github.com/receptron/grapys)

## Sample Express Agent Server  
[GraphAI Agent Server](https://github.com/receptron/graphai-agent-server)

## Agent Template Generator  
[Create GraphAI Agent](https://github.com/isamu/create-graphai-agent)

## VS Code IntelliSense for GraphAI  
[GraphAI Validate](https://github.com/isamu/graphai-validate)

## VS Code Graph Data Visualizer  
[GraphAI Visualizer](https://github.com/kawamataryo/graphai-visualizer)




