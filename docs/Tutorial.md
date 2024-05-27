# GraphAI Tutorial

## Hello World

GraphAI (https://github.com/receptron/graphai) is an open source project, which allows non-programers to build AI applications by describing data flows in declarative language, GraphAI. Here is the "Hello World" of GraphAI. 

```YAML
version: 0.3
nodes:
  llm:
    agent: openAIAgent
    params:
      model: gpt-4o
    inputs:
      - Explain ML's transformer in 100 words.
  output:
    agent: copyAgent
    console:
      after: true
    inputs:
      - :llm.choices.$0.message.content
```

It has two nodes, "llm" and "output", The "llm" node is associated with "openAIAgent", which calls OpenAI's chat completion API, and takes "Explain ML's transformer in 100 words." as an input, which acts as a user prompt. The "output" node receives the input from the "llm" node, and print it out to the console.

## Installation

You can try it on your own machine by installing "GraphAI client" with following command:
```
npm i -g  @receptron/graphai_cli
```
Then, you need to create a .env file containing your OPENAI_API_KEY in our current directory.
```
OPENAI_API_KEY=sk-...
```
After that you prepare the yaml file (such as "hello.yaml"), and type
```
graphai hello.yaml
```

## ChatBot: Loop

The dataflow graph needs to be acyclic, but we added a few control flow mechanism, such as loop, nesting, if/unless and map-reduce. 

Here is a chatbot application using the loop, which allows the user to talk to the LLM until she/he types "/bye".

```YAML
version: 0.3
loop:
  while: :continue
nodes:
  continue:
    value: true
    update: :checkInput.continue
  messages:
    value: []
    update: :reducer
  userInput:
    agent: textInputAgent
    params:
      message: "You:"
  checkInput:
    agent: propertyFilterAgent
    params:
      inspect:
        - propId: continue
          notEqual: /bye
    inputs:
      - {}
      - :userInput
  userMessage:
    agent: propertyFilterAgent
    params:
      inject:
        - propId: content
          from: 1
    inputs:
      - role: user
      - :userInput
  appendedMessages:
    agent: pushAgent
    inputs:
      - :messages
      - :userMessage
  llm:
    agent: openAIAgent
    inputs:
      - null
      - :appendedMessages
  output:
    agent: stringTemplateAgent
    params:
      template: "\e[32mLlama3\e[0m: ${0}"
    console:
      after: true
    inputs:
      - :llm.choices.$0.message.content
  reducer:
    agent: pushAgent
    inputs:
      - :appendedMessages
      - :llm.choices.$0.message
```

1. The user is prompted to input a message with "You:".
2. `userInput` captures the user's input.
3. `checkInput` evaluates if the input is "/bye". If it is, `continue` is set to `false`, stopping the loop.
4. `userMessage` formats the user's input as a message with the role "user".
5. `appendedMessages` appends the user's message to the existing messages array.
6. `llm` uses the updated messages array to generate a response from the AI model.
7. `output` formats the AI agent's response and prints it to the console.
8. `reducer` appends the AI agent's response to the messages array.
9. The loop continues as long as `continue` is `true`.

## Weather: Function Call and nested graph

Here is an example, which uses the function call capability and nested graph.

```YAML
version: 0.3
loop:
  while: :continue
nodes:
  continue:
    value: true
    update: :checkInput.continue
  messages:
    value:
      - role: system
        content: You are a meteorologist. Use getWeather API, only when the user ask for
          the weather information.
    update: :reducer
    isResult: true
  userInput:
    agent: textInputAgent
    params:
      message: "Location:"
  checkInput:
    agent: propertyFilterAgent
    params:
      inspect:
        - propId: continue
          notEqual: /bye
    inputs:
      - {}
      - :userInput
  userMessage:
    agent: propertyFilterAgent
    params:
      inject:
        - propId: content
          from: 1
    inputs:
      - role: user
      - :userInput
  messagesWithUserInput:
    agent: pushAgent
    inputs:
      - :messages
      - :userMessage
    if: :checkInput.continue
  llmCall:
    agent: openAIAgent
    params:
      tools:
        - type: function
          function:
            name: getWeather
            description: get wether information of the specified location
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
    inputs:
      - null
      - :messagesWithUserInput
  output:
    agent: stringTemplateAgent
    params:
      template: "Weather: ${0}"
    console:
      after: true
    inputs:
      - :llmCall.choices.$0.message.content
    if: :llmCall.choices.$0.message.content
  messagesWithFirstRes:
    agent: pushAgent
    inputs:
      - :messagesWithUserInput
      - :llmCall.choices.$0.message
  tool_calls:
    agent: nestedAgent
    inputs:
      - :llmCall.choices.$0.message.tool_calls
      - :messagesWithFirstRes
    if: :llmCall.choices.$0.message.tool_calls
    graph:
      nodes:
        outputFetching:
          agent: stringTemplateAgent
          params:
            template: "... fetching weather info: ${0}"
          console:
            after: true
          inputs:
            - :$0.$0.function.arguments
        parser:
          agent: jsonParserAgent
          inputs:
            - :$0.$0.function.arguments
        urlPoints:
          agent: stringTemplateAgent
          params:
            template: https://api.weather.gov/points/${0},${1}
          inputs:
            - :parser.latitude
            - :parser.longitude
        fetchPoints:
          agent: fetchAgent
          inputs:
            - :urlPoints
            - null
            - User-Agent: (receptron.org)
        fetchForecast:
          agent: fetchAgent
          params:
            type: text
          inputs:
            - :fetchPoints.properties.forecast
            - null
            - User-Agent: (receptron.org)
          unless: :fetchPoints.onError
        extractError:
          agent: stringTemplateAgent
          params:
            template: "${0}: ${1}"
          inputs:
            - :fetchPoints.onError.error.title
            - :fetchPoints.onError.error.detail
          if: :fetchPoints.onError
        responseText:
          agent: copyAgent
          anyInput: true
          inputs:
            - :fetchForecast
            - :extractError
        toolMessage:
          agent: propertyFilterAgent
          params:
            inject:
              - propId: tool_call_id
                from: 1
              - propId: name
                from: 2
              - propId: content
                from: 3
          inputs:
            - role: tool
            - :$0.$0.id
            - :$0.$0.function.name
            - :responseText
        messagesWithToolRes:
          agent: pushAgent
          inputs:
            - :$1
            - :toolMessage
        llmCall:
          agent: openAIAgent
          inputs:
            - null
            - :messagesWithToolRes
        output:
          agent: stringTemplateAgent
          params:
            template: "Weather: ${0}"
          console:
            after: true
          inputs:
            - :llmCall.choices.$0.message.content
        messagesWithSecondRes:
          agent: pushAgent
          inputs:
            - :messagesWithToolRes
            - :llmCall.choices.$0.message
          isResult: true
  no_tool_calls:
    agent: copyAgent
    unless: :llmCall.choices.$0.message.tool_calls
    inputs:
      - :messagesWithFirstRes
  reducer:
    agent: copyAgent
    anyInput: true
    inputs:
      - :no_tool_calls
      - :tool_calls.messagesWithSecondRes
```

1. **Loop Execution**: The graph loops continuously until the condition specified by the `continue` node is false.
2. **User Input Prompt**: The system prompts the user to input a location.
3. **User Input Handling**: The input is checked to determine if the conversation should continue.
4. **Message Construction**: User input is processed and added to the conversation messages.
5. **LLM Call**: The system calls an AI model to generate a response based on the conversation messages.
6. **Tool Invocation**: If the AI response includes a tool call (e.g., to fetch weather data), the nested graph handles the tool call and retrieves the necessary information.
7. **Output Generation**: The final response, including the fetched weather information, is formatted and output to the console.

## Dynamic Graph Generation

It is even possible to let the LLM to dynamically generate a GraphAI yaml and run it, which is an equivalent to the code interpreter.

Here is an example (I'm not able to paste the code here, because thd markdown parser will be confused with embedded json tags):

[https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml](https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml)

This application generates a new GraphAI graph based on a sample GraphAI graph ([reception.yaml](https://github.com/receptron/graphai/blob/main/packages/samples/data/reception.json), which retrieves the name, date of birth and gender from the user), and run it. The generated app retrieves the name, address and phone number instead.