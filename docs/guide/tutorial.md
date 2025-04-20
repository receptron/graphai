# GraphAI Tutorial

## Hello World

[GraphAI](https://github.com/receptron/graphai) is an open source project, which allows non-programmers to build AI applications by describing data flows in a declarative language, GraphAI.

Here is the "Hello World" of GraphAI.

```YAML
version: 0.5
nodes:
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      prompt: Explain ML's transformer in 100 words.
  output:
    agent: copyAgent
    params:
      namedKey: text
    console:
      after: true
    inputs:
      text: :llm.text

```

It has two nodes:

1. **llm**: This node is associated with "openAIAgent", which calls OpenAI's chat completion API. It takes "Explain ML's transformer in 100 words." as an input (the user prompt) and outputs the result from the chat completion API.
2. **output**: This node receives the output of the **llm** node, as an input, and prints it out to the console.

Notice that **llm** node will be executed immediately because all the inputs are available at the beginning, while **output** node will be executed when the data from **llm** node becomes available.

## Installation

You can try it on your own machine by installing "GraphAI client" with the following command:
```
npm i -g  @receptron/graphai_cli
```
Then, you need to create a .env file containing your OPENAI_API_KEY in your current directory.
```
OPENAI_API_KEY=sk-...
```
After that, you prepare the yaml file (such as "hello.yaml"), and type
```
graphai hello.yaml
```

Many sample GraphAI YAML files are available under [GraphAI Samples](https://github.com/receptron/graphai_samples).

## Computed Node and Static Node

There are two types of nodes in GraphAI, *computed nodes* and *static nodes*.

A computed node is associated with an *agent*, which performs a certain computation. Both nodes in the previous example are *computed nodes*.

A *static node* is a placeholder for a value, just like a *variable* in computer languages.

The example below performs the same operation as the previous example but uses one *static node*, **prompt**, which holds the value "Explain ML's transformer in 100 words".

```YAML
version: 0.5
nodes:
  prompt:
    value: Explain ML's transformer in 100 words.
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      prompt: :prompt
  output:
    agent: copyAgent
    params:
      namedKey: text
    console:
      after: true
    inputs:
      text: :llm.text

```

## Loop / Mapping
The dataflow graph needs to be acyclic by design, but we added a few control flow mechanisms, such as loop, nesting, if/unless, and mapping (of map-reduce).

### Loop
Here is a simple application, which uses **loop**.

```YAML
version: 0.5
loop:
  while: :fruits
nodes:
  fruits:
    value:
      - apple
      - lemon
      - banana
    update: :shift.array
  result:
    value: []
    update: :reducer.array
    isResult: true
  shift:
    agent: shiftAgent
    inputs:
      array: :fruits
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      prompt: What is the typical color of ${:shift.item}? Just answer the color.
  reducer:
    agent: pushAgent
    inputs:
      array: :result
      item: :llm.text

```

1. **fruits**: This static node holds the list of fruits at the beginning but updated with the array property of **shift** node after each iteration.
2. **result**: This static node starts with an empty array, but updated with the value of **reducer** node after each iteration.
3. **shift**: This node takes the first item from the value from **fruits** node, and outputs the remaining array and item as properties.
4. **llm**: This computed node generates a prompt using the template "What is the typical color of ${:shift.item}? Just answer the color." by applying the item property from the shift node's output. It then passes this prompt to gpt-4o to obtain the generated result.
5. **reducer**: This node pushes the content from the output of **llm** node to the value of **result** node.

Please notice that each item in the array will be processed sequentially. To process them concurrently, see the section below.

### Mapping

Here is a simple application, which uses **map**.

```YAML
version: 0.5
nodes:
  fruits:
    value:
      - apple
      - lemon
      - banana
  map:
    agent: mapAgent
    inputs:
      rows: :fruits
    isResult: true
    graph:
      nodes:
        llm:
          agent: openAIAgent
          params:
            model: gpt-4o
          inputs:
            prompt: What is the typical color of ${:row}? Just answer the color.
        result:
          agent: copyAgent
          params:
            namedKey: item
          inputs:
            item: :llm.text
          isResult: true

```

1. **fruits**: This static node holds the list of fruits.
2. **map**: This node is associated with **mapAgent**, which performs the mapping, by executing the nested graph for each item for the value of **fruits** node, and outputs the combined results.
3. **llm**: This computed node generates a prompt using the template "What is the typical color of ${:row}? Just answer the color." by applying the item property from the value of **fruits** node. It then passes this prompt to gpt-4o to obtain the generated result.
4. **result**: This node retrieves the text property from the output of **llm** node.

Please notice that each item in the array will be processed concurrently.

## ChatBot

Here is a chatbot application using the loop, which allows the user to talk to the LLM until she/he types "/bye".

```YAML
version: 0.5
loop:
  while: :continue
nodes:
  continue:
    value: true
    update: :checkInput.result
  messages:
    value: []
    update: :llm.messages
    isResult: true
  userInput:
    agent: textInputAgent
    params:
      message: "You:"
      required: true
  checkInput:
    agent: compareAgent
    inputs:
      array:
        - :userInput.text
        - "!="
        - /bye
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      messages: :messages
      prompt: :userInput.text
  output:
    agent: stringTemplateAgent
    console:
      after: true
    inputs:
      text: "\e[32mAgent\e[0m: ${:llm.text}"

```

1. The user is prompted to input a message with "You:".
2. `userInput` captures the user's input.
3. `checkInput` evaluates if the input is "/bye". If it is, `continue` is set to `false`, stopping the loop.
4. `llm` uses the updated messages array to generate a response from the AI model.
5. `output` formats the AI agent's response and prints it to the console.
6. `reducer` appends the AI agent's response to the messages array.
7. The loop continues as long as `continue` is `true`.

## Weather: Function Call and Nested Graph

Here is an example, which uses the function call capability and nested graph.

```YAML
version: 0.5
loop:
  while: :continue
nodes:
  continue:
    value: true
    update: :checkInput.result
  messages:
    value:
      - role: system
        content: You are a meteorologist. Use getWeather API, only when the user asks for
          the weather information.
    update: :reducer.array.$0
    isResult: true
  userInput:
    agent: textInputAgent
    params:
      message: "Location:"
  checkInput:
    agent: compareAgent
    inputs:
      array:
        - :userInput.text
        - "!="
        - /bye
  llmCall:
    agent: openAIAgent
    params:
      tools:
        - type: function
          function:
            name: getWeather
            description: get weather information of the specified location
            parameters:
              type: object
              properties:
                latitude:
                  type: number
                  description: The latitude of the location.
                longitude:
                  type: number
                  description: The longitude of the location.
              required:
                - latitude
                - longitude
      model: gpt-4o
    inputs:
      messages: :messages
      prompt: :userInput.text
    if: :checkInput
  output:
    agent: stringTemplateAgent
    inputs:
      text: "Weather: ${:llmCall.text}"
    console:
      after: true
    if: :llmCall.text
  messagesWithFirstRes:
    agent: pushAgent
    inputs:
      array: :messages
      items:
        - :userInput.message
        - :llmCall.message
  tool_calls:
    agent: nestedAgent
    inputs:
      parent_messages: :messagesWithFirstRes.array
      parent_tool: :llmCall.tool
    if: :llmCall.tool
    graph:
      nodes:
        outputFetching:
          agent: stringTemplateAgent
          inputs:
            text: "... fetching weather info: ${:parent_tool.arguments.latitude},
              ${:parent_tool.arguments.longitude}"
          console:
            after: true
        fetchPoints:
          agent: fetchAgent
          inputs:
            url: https://api.weather.gov/points/${:parent_tool.arguments.latitude},${:parent_tool.arguments.longitude}
            headers:
              User-Agent: (receptron.org)
        fetchForecast:
          agent: fetchAgent
          params:
            type: text
          inputs:
            url: :fetchPoints.properties.forecast
            headers:
              User-Agent: (receptron.org)
          unless: :fetchPoints.onError
        extractError:
          agent: stringTemplateAgent
          inputs:
            text: "${:fetchPoints.onError.error.title}:
              ${:fetchPoints.onError.error.detail}"
          if: :fetchPoints.onError
        responseText:
          agent: copyAgent
          anyInput: true
          inputs:
            array:
              - :fetchForecast
              - :extractError
        messagesWithToolRes:
          agent: pushAgent
          inputs:
            array: :parent_messages
            item:
              role: tool
              tool_call_id: :parent_tool.id
              name: :parent_tool.name
              content: :responseText.array.$0
        llmCall:
          agent: openAIAgent
          inputs:
            messages: :messagesWithToolRes.array
          params:
            model: gpt-4o
        output:
          agent: stringTemplateAgent
          inputs:
            text: "Weather: ${:llmCall.text}"
          console:
            after: true
        messagesWithSecondRes:
          agent: pushAgent
          inputs:
            array: :messagesWithToolRes.array
            item: :llmCall.message
          isResult: true
  no_tool_calls:
    agent: copyAgent
    unless: :llmCall.tool
    inputs:
      result: :messagesWithFirstRes.array
  reducer:
    agent: copyAgent
    anyInput: true
    inputs:
      array:
        - :no_tool_calls.result
        - :tool_calls.messagesWithSecondRes.array

```

1. **Loop Execution**: The graph loops continuously until the condition specified by the `continue` node is false.
2. **User Input Prompt**: The system prompts the user to input a location.
3. **User Input Handling**: The input is checked to determine if the conversation should continue.
4. **Message Construction**: User input is processed and added to the conversation messages.
5. **LLM Call**: The system calls an AI model to generate a response based on the conversation messages.
6. **Tool Invocation**: If the AI response includes a tool call (e.g., to fetch weather data), the nested graph handles the tool call and retrieves the necessary information.
7. **Output Generation**: The final response, including the fetched weather information, is formatted and output to the console.

## Dynamic Graph Generation

It is even possible to let the LLM dynamically generate a GraphAI yaml and run it, which is equivalent to the code interpreter.

Here is an example (I'm not able to paste the code here, because the markdown parser will be confused with embedded json tags):

[https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml](https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml)

This sample application generates a new GraphAI graph based on a sample GraphAI graph ([reception.yaml](https://github.com/receptron/graphai/blob/main/packages/samples/data/reception.json), which retrieves the name, date of birth, and gender from the user), and runs it. The generated app retrieves the name, address, and phone number instead.

## In-memory RAG

This sample application performs an in-memory RAG by dividing a Wikipedia article into chunks, gets embedding vectors for those chunks, and creates an appropriate prompt based on the cosine similarities.

```YAML
version: 0.5
nodes:
  source:
    value:
      name: Sam Bankman-Fried
      topic: sentence by the court
      query: describe the final sentence by the court for Sam Bank-Fried
  wikipedia:
    console:
      before: ...fetching data from wikipedia
    agent: wikipediaAgent
    inputs:
      query: :source.name
    params:
      lang: en
  chunks:
    console:
      before: ...splitting the article into chunks
    agent: stringSplitterAgent
    inputs:
      text: :wikipedia.content
  chunkEmbeddings:
    console:
      before: ...fetching embeddings for chunks
    agent: stringEmbeddingsAgent
    inputs:
      array: :chunks.contents
  topicEmbedding:
    console:
      before: ...fetching embedding for the topic
    agent: stringEmbeddingsAgent
    inputs:
      item: :source.topic
  similarities:
    agent: dotProductAgent
    inputs:
      matrix: :chunkEmbeddings
      vector: :topicEmbedding.$0
  sortedChunks:
    agent: sortByValuesAgent
    inputs:
      array: :chunks.contents
      values: :similarities
  referenceText:
    agent: tokenBoundStringsAgent
    inputs:
      chunks: :sortedChunks
    params:
      limit: 5000
  prompt:
    agent: stringTemplateAgent
    inputs:
      prompt: :source.query
      text: :referenceText.content
    params:
      template: |-
        Using the following document, ${text}

        ${prompt}
  RagQuery:
    console:
      before: ...performing the RAG query
    agent: openAIAgent
    inputs:
      prompt: :prompt
    params:
      model: gpt-4o
  OneShotQuery:
    agent: openAIAgent
    inputs:
      prompt: :source.query
    params:
      model: gpt-4o
  RagResult:
    agent: copyAgent
    inputs:
      result: :RagQuery.text
    isResult: true
  OneShotResult:
    agent: copyAgent
    inputs:
      result: :OneShotQuery.text
    isResult: true

```
