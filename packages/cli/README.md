# GraphAI cli🤖

GraphAI command line tool

## Install 🚀

```sh
npm i -g  @receptron/graphai_cli
```

## Usage 📖 

```
graphai <yaml_or_json_file>

run GraphAI with GraphAI file.

Positionals:
  yaml_or_json_file  yaml or json file                                  [string]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -l, --list     agents list
  -s, --sample   agent sample data                                      [string]
  -d, --detail   agent detail                                           [string]
  -v, --verbose  verbose log               [boolean] [required] [default: false]
  -m, --mermaid  mermaid                   [boolean] [required] [default: false]
      --yaml     dump yaml                 [boolean] [required] [default: false]
      --json     dump json                 [boolean] [required] [default: false]
      --log      output log                                             [string]
```

### Run GraphAI 🔥

```
graphai test_yaml/test_base.yml 
```

### Get Agents List 📚

```
graphai -l

Available Agents
- bypassAgent
- copyMessageAgent
- countingAgent
- dataObjectMergeTemplateAgent
- dataSumTemplateAgent
- dotProductAgent
- echoAgent
- mapAgent
- mergeNodeIdAgent
- nestedAgent
- popAgent
- pushAgent
- shiftAgent
- slashGPTAgent
- sleeperAgent
- sleeperAgentDebug
- sortByValuesAgent
- stringEmbeddingsAgent
- stringSplitterAgent
- stringTemplateAgent
- tokenBoundStringsAgent
- totalAgent
```
