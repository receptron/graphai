# GraphAI Tutorial

## Hello World

GraphAI (https://github.com/receptron/graphai) is an open source project, which allows non-programmers to build AI applications by describing data flows in a declarative language, GraphAI. 

Here is the "Hello World" of GraphAI. 

```YAML
${packages/samples/graph_data/openai/simple.yaml}
```

It has two nodes:

1. **llm**: This node is associated with "openAIAgent", which calls OpenAI's chat completion API. It takes "Explain ML's transformer in 100 words." as an input (the user prompt) and outputs the result from the chat completion API. 
2. **output**: This node receives the output of the **llm** node, as an input, and print it out to the console.

Notice that **llm** node will be executed immediately because all the inputs are available at the beginning, while **output** will be executed when the data from **llm** node becomes available.

## Installation

You can try it on your own machine by installing "GraphAI client" with following command:
```
npm i -g  @receptron/graphai_cli
```
Then, you need to create a .env file containing your OPENAI_API_KEY in your current directory.
```
OPENAI_API_KEY=sk-...
```
After that you prepare the yaml file (such as "hello.yaml"), and type
```
graphai hello.yaml
```

Many sample GraphAI YAML files are available under [Graphai Samples](https://github.com/receptron/graphai_samples).

## Computed Node and Static Node

There are two types of nodes in GraphAI, *computed nodes* and *static nodes*.

A computed node is associated with an *agent*, which performs a certain computation. Both nodes in the previous examples are *computed nodes*.

A *static nodes* is a place holder of a value, just like a *variable* in computer languages.

The example below performs the same operation, but uses one *static node*, **prompt**, which holds the value "Explain ML's transformer in 100 words".

```YAML
${packages/samples/graph_data/openai/simple2.yaml}
```

## Loop

The dataflow graph needs to be acyclic by design, but we added a few control flow mechanisms, such as loop, nesting, if/unless and mapping (of map-reduce). 

Here is a simple application, which uses **loop**.

```YAML
${packages/samples/graph_data/openai/loop.yaml}
```

1. **fruits**: This static node holds the list of fruits at the begining but updated with the array property of **shift** node after each iteration.
2. **result**: This static node starts with an empty array, but updated with the value of **reducer** node after each iteration.
3. **shift**: This node takes the first item from the value from **fruits** node, and output the remaining array and item as properties.
4. **llm**: This computed node generates a prompt using the template "What is the typical color of ${:shift.item}? Just answer the color." by applying the item property from the shift node's output. It then passes this prompt to gpt-4o to obtain the generated result.
5. **reducer**: This node pushes the content from the output of **llm** node to the value of **result** node.

Please notice that each item in the array will be processed sequentially. To process them concurrently, see the section below. 

## Mapping

Here is a simple application, which uses **map**.

```YAML
version: 0.5
nodes:
  fruits:
    value: [apple, lemon, banana]
  map:
    agent: mapAgent
    inputs:
      rows: :fruits
    isResult: true
    graph:
      nodes:
        prompt:
          agent: stringTemplateAgent
          params:
            template: What is the typical color of ${item}? Just answer the color.
          inputs:
            item: :row
        llm:
          agent: openAIAgent
          params:
            model: gpt-4o
          inputs: 
            prompt: :prompt
        result:
          agent: copyAgent
          inputs:
            text: :llm.text
          isResult: true
```

1. **fruits**: This static node holds the list of fruits.
2. **map**: This node is associated with **mapAgent**, which performs the mapping, by executing the nested graph for each item for the value of **fruits** node, and outputs the combined results.
3. **prompt**: This node creates a prompt by filling the `${0}` of the template string with each item of the value of **fruits** node.
4. **llm**: This node gives the generated text by the **prompt** node to `gpt-4o` and outputs the result.
5. **result**: This node retrieves the content property from the output of **llm** node.

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
    update: :checkInput
  messages:
    value: []
    update: :reducer.array
  userInput:
    agent: textInputAgent
    params:
      message: "You:"
  checkInput:
    agent: compareAgent
    inputs:
      array:
        - ":userInput.text"
        - "!="
        - "/bye"
  appendedMessages:
    agent: pushAgent
    inputs:
      array: :messages
      item: :userInput.message
  llm:
    agent: openAIAgent
    inputs:
      messages: :appendedMessages.array
  output:
    agent: stringTemplateAgent
    params:
      template: "\e[32mLLM\e[0m: ${text}"
    console:
      after: true
    inputs:
      text: :llm.text
  reducer:
    agent: pushAgent
    inputs:
      array: :appendedMessages.array
      item: :llm.message
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
${packages/samples/graph_data/openai/weather.yaml}
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

This sample application generates a new GraphAI graph based on a sample GraphAI graph ([reception.yaml](https://github.com/receptron/graphai/blob/main/packages/samples/data/reception.json), which retrieves the name, date of birth and gender from the user), and run it. The generated app retrieves the name, address and phone number instead.

## In-memory RAG

This sample application performs an in-memory RAG by dividing a Wikipedi article into chunks, get embedding vectors for those chunks and create an appropriate prompt based on the cosine similarities. 

```YAML
${packages/samples/graph_data/openai/wikipedia_rag.yaml}
```