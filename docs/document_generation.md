
## GraphAI apiDoc

https://receptron.github.io/graphai/apiDoc/

in graphai/packages/graphai

```
yarn run doc
```

typedoc used.

## agentDoc

Automatically generate a README.md for each agent package.

https://github.com/receptron/graphai/blob/main/docs/agentDocs/README.md

in graphai/packages/cli

```
yarn run doc
```

This script generates a document from the AgentFunctionInfo of all agents.

Github Action automatically run this script.

## GraphData examples from graphData on Test each each packages

```
yarn run examplesDoc
```

It then reads test GraphData and writes markdown files.
These markdown files use the agent doc command.

- agentDir/docs/GraphDataJSON.md
- agentDir/docs/GraphDataYAML.md



## agentDoc for each agents

```
npx agentdoc
```

(bin/agentdoc of @graphai/agentdoc)

read from package.json and docs/*.md and source code,

writes to README.md in each package

The implementation of this script is `graphai/packages/agentdoc/src/agentdoc.ts`.


If you want to add your own text to the readme, add the following md under docs.

- GraphDataJSON.md
- READMEBefore.md
- READMEAfter.md

## markdown template

Some markdown files are generated by using templates and importing YAML files.

- docs/Tutorial.md
- packages/graphai/README.md

```
yarn run markdown
```


### Graph Data sample

Generate graph data in YAML format from the GraphAI sample in TypeScript.

in `packages/samples/`

```
yarn run doc
```

### docs/agentDocs

Generate agent docs as mono repository documents collectively.

```
yarn run monoRepoAgentDoc
```

This script includes meta-agent packages, so you need to maintain them.
Anything not included in the meta-package needs to be specified separately.


src/monoRepoAgentDocs.ts