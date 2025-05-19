<picture>
  <source media="(prefers-color-scheme: light)" srcset="./docs/images/readme_logo_light.png">
  <source media="(prefers-color-scheme: dark)" srcset="./docs/images/readme_logo_dark.png">
  <img alt="GraphAI" src="./docs/images/readme_logo_light.png" width="800">
</picture>

[![Release Notes](https://img.shields.io/github/release/receptron/graphai?style=flat-square)](https://github.com/receptron/graphai/releases)
[![GitHub star chart](https://img.shields.io/github/stars/receptron/graphai?style=flat-square)](https://star-history.com/#receptron/graphai)
![NPM Downloads](https://img.shields.io/npm/dw/graphai)
[![Open Issues](https://img.shields.io/github/issues-raw/receptron/graphai?style=flat-square)](https://github.com/receptron/graphai/issues)

GraphAI is an asynchronous data flow execution engine, which allows developers to build *agentic applications* by describing *agent workflows* as declarative data flow graphs in YAML or JSON.

## Documentation

[Official Website](https://graphai.info)

### SPECS
- [Scientific Paper](https://graphai.info/guide/Paper.html)
- [GraphAI core](./packages/graphai/README.md)

### TypeScript API Document
- [API Document](./APIDocument.md)
- [API Document by typedoc](https://receptron.github.io/graphai/apiDoc/)

### Agent Document

- [Agent Document](./docs/agentDocs/README.md)

### Tools
- [GraphAI CLI](./packages/cli/README.md)

## Application Samples
- [Tutorial](https://graphai.info/guide/tutorial.html)
- [GraphAI samples for developers](./packages/samples/README.md)
- [GraphAI samples for end users](https://github.com/receptron/graphai_samples)

## Use Case
- [Mulmocast](https://github.com/receptron/mulmocast-cli)  
  A CLI tool for generating podcast and video content from script files (MulmoScript). Automates the process of creating audio, images, and video from structured MulmoScript files.
  - [GraphAI Agent in Mulmocast](https://github.com/receptron/mulmocast-cli/tree/main/src/agents)
  - [GraphData in Mulmocast](https://github.com/receptron/mulmocast-cli/tree/main/src)
    - `./tools/`
      - `story_to_script.ts`
      - `create_mulmo_script_interactively.ts`
      - `create_mulmo_script_from_url.ts`
    - `./actions/`
      - `audio.ts`
      - `captions.ts`
      - `images.ts`
      - `translate.ts`

## Development
- [Collaboration](./Collaboration.md)

## npm links

### GraphAI
https://www.npmjs.com/package/graphai

### GraphAI Agents
https://www.npmjs.com/org/graphai

### GraphAI Utilities
https://www.npmjs.com/org/receptron

## Web demo & tool

### GraphAI web demo
https://github.com/receptron/graphai-demo-web

### Grapys - GraphAI GUI tool
https://github.com/receptron/grapys
