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
# Run test_yaml/test_base.yml (Make sure you are in the correct directory)
graphai test_yaml/test_base.yml 
```

### Get Agents List 📚

```
graphai -l

Available Agents
* anthropicAgent - Anthropic Agent
* arrayFlatAgent - Array Flat Agent
* arrayJoinAgent - Array Join Agent
* compareAgent - compare
* copy2ArrayAgent - Copy2Array agent
* copyAgent - Returns namedInputs
* copyMessageAgent - CopyMessage agent
* countingAgent - Counting agent
* dataObjectMergeTemplateAgent - Merge object
* dataSumTemplateAgent - Returns the sum of input values
* dotProductAgent - dotProduct Agent
* echoAgent - Echo agent
* fetchAgent - Retrieves JSON data from the specified URL
* fileReadAgent - Read data from file system and returns data
* fileWriteAgent - Write data to file system
* geminiAgent - Gemini Agent
* groqAgent - Groq Agent
* images2messageAgent - Returns the message data for llm include image
* jsonParserAgent - Template agent
* mapAgent - Map Agent
* mergeNodeIdAgent - merge node id agent
* nestedAgent - nested Agent
* openAIAgent - OpenAI Agent
* openAIImageAgent - OpenAI Image Agent
* pathUtilsAgent - Path utils
* popAgent - Pop Agent
* propertyFilterAgent - Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'
* pushAgent - push Agent
* replicateAgent - Replicate Agent
* shiftAgent - shift Agent
* sleepAndMergeAgent - sleeper and merge Agent
* sleeperAgent - sleeper Agent
* sleeperAgentDebug - sleeper debug Agent
* sortByValuesAgent - sortByValues Agent
* streamMockAgent - Stream mock agent
* stringCaseVariantsAgent - Format String Cases agent
* stringEmbeddingsAgent - Embeddings Agent
* stringSplitterAgent - This agent strip one long string into chunks using following parameters
* stringTemplateAgent - Template agent
* stringUpdateTextAgent - 
* textInputAgent - Text Input Agent
* tokenBoundStringsAgent - token bound Agent
* totalAgent - Returns the sum of input values
* vanillaFetchAgent - Retrieves JSON data from the specified URL
* wikipediaAgent - Retrieves data from wikipedia
```
