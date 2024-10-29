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
* anthropicAgent - Anthropic Agent
* arrayFlatAgent - Array Flat Agent
* copy2ArrayAgent - Copy2Array agent
* copyAgent - Returns inputs[0]
* copyMessageAgent - CopyMessage agent
* countingAgent - Counting agent
* dataObjectMergeTemplateAgent - Merge object
* dataSumTemplateAgent - Returns the sum of input values
* dotProductAgent - dotProduct Agent
* echoAgent - Echo agent
* fetchAgent - Retrieves JSON data from the specified URL
* geminiAgent - Gemini Agent
* groqAgent - Groq Agent
* jsonParserAgent - Template agent
* mapAgent - Map Agent
* mergeNodeIdAgent - merge node id agent
* nestedAgent - nested Agent
* openAIAgent - OpenAI Agent
* openAIImageAgent - OpenAI Image Agent
* popAgent - Pop Agent
* propertyFilterAgent - Filter properties based on property name either with 'include' or 'exclude'
* pushAgent - push Agent
* replicateAgent - Replicate Agent
* shiftAgent - shift Agent
* slashGPTAgent - Slash GPT Agent
* sleeperAgent - sleeper Agent
* sleeperAgentDebug - sleeper debug Agent
* sortByValuesAgent - sortByValues Agent
* streamMockAgent - Stream mock agent
* stringEmbeddingsAgent - Embeddings Agent
* stringSplitterAgent - This agent strip one long string into chunks using following parameters
* stringTemplateAgent - Template agent
* textInputAgent - Text Input Agent
* tokenBoundStringsAgent - token bound Agent
* totalAgent - Returns the sum of input values
* vanillaFetchAgent - Retrieves JSON data from the specified URL
* wikipediaAgent - Retrieves data from wikipedia
* workerAgent - Map Agent
```
