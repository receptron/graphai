# GraphAI Tutorial

## Hello World

[GraphAI](https://github.com/receptron/graphai) is an open-source project, which allows non-programmers to build AI applications by describing data flows in a declarative language, GraphAI.

Here is the "Hello World" of GraphAI.

```YAML
${packages/samples/graph_data/openai/simple.yaml}
```

It has two nodes:

1. **llm**: This node is associated with "openAIAgent", which calls OpenAI's chat completion API. It takes "Explain ML's transformer in 100 words." as an input (the user prompt) and outputs the result from the chat completion API.
2. **output**: This node receives the output of the **llm** node, as an input, and prints it out to the console.

Notice that **llm** node will be executed immediately because all the inputs are available at the beginning, while **output** will be executed when the data from **llm** node becomes available.

## Installation

You can try it on your own machine by installing "GraphAI client" with the following command:
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

Many sample GraphAI YAML files are available under [GraphAI Samples](https://github.com/receptron/graphai_samples).

## Computed Node and Static Node

There are two types of nodes in GraphAI, *computed nodes* and *static nodes*.

A computed node is associated with an *agent*, which performs a certain computation. Both nodes in the previous examples are *computed nodes*.

A *static node* is a placeholder of a value, just like a *variable* in computer languages.

The example below performs the same operation, but uses one *static node*, **prompt**, which holds the value "Explain ML's transformer in 100 words".

```YAML
${packages/samples/graph_data/openai/simple2.yaml}
```

## Loop

The data flow graph needs to be acyclic by design, but we added a few control flow mechanisms, such as loop, nesting, if/unless, and mapping (of map-reduce).

Here is a simple application, which uses **loop**.

```YAML
${packages/samples/graph_data/openai/loop.yaml}
```

1. **fruits**: This static node holds the list of fruits at the beginning, but updates with the array property of the **shift** node after each iteration.
2. **result**: This static node starts with an empty array, but updates with the array property of the **reducer** node after each iteration.
3. **shift**: This node takes the first item from the value from the **fruits** node, and outputs the remaining array and item as properties.
4. **llm**: This computed node generates a prompt using the template "What is the typical color of ${:shift.item}? Just answer the color." by applying the item property from the shift node's output. It then passes this prompt to gpt-4o to obtain the generated result.
5. **reducer**: This node pushes the content from the output of **llm** node to the value of **result** node.

Please notice that each item in the array will be processed sequentially.
Loop until the array of **fruits** nodes is empty.
To process them concurrently, see the section below.

## Mapping

Here is a simple application, which uses **map**.

```YAML
${packages/samples/graph_data/openai/map.yaml}
```

1. **fruits**: This static node holds the list of fruits.
2. **map**: This node is associated with **mapAgent**, which performs the mapping, by executing the nested graph for each item for the value of **fruits** node, and outputs the combined results.
3. **llm**: This computed node generates a prompt using the template "What is the typical color of ${:row}? Just answer the color." by applying the item property from the value of **fruits** node. It then passes this prompt to gpt-4o to obtain the generated result.
4. **result**: This node retrieves the text property from the output of **llm** node.

Please notice that each item in the array will be processed concurrently.

## ChatBot

Here is a chatbot application using the loop, which allows the user to talk to the LLM until she/he types "/bye".

```YAML
${packages/samples/graph_data/openai/chat.yaml}
```

1. The user is prompted to input a message with "You:".
2. `userInput` captures the user's input.
3. `checkInput` evaluates if the input is "/bye". If it is, `continue` is set to `false`, stopping the loop.
4. `llm` uses the updated messages array to generate a response from the AI model.
5. `output` formats the AI agent's response and prints it to the console.
6. `reducer` appends the AI agent's response to the messages array.
7. The loop continues as long as `continue` is `true`.

## Weather: Function Calling and nested graph

Here is an example, which uses the function calling capability and nested graph.

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

It is even possible to let the LLM dynamically generate a GraphAI yaml and run it, which is equivalent to the code interpreter.

Here is an example (I'm not able to paste the code here, because the markdown parser will be confused with embedded JSON tags):

[https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml](https://github.com/receptron/graphai_samples/blob/main/samples/openai/metachat.yaml)

This sample application generates a new GraphAI graph based on a sample GraphAI graph ([reception.yaml](https://github.com/receptron/graphai/blob/main/packages/samples/data/reception.json), which retrieves the name, date of birth and gender from the user), and runs it. The generated app retrieves the name, address, and phone number instead.

## In-memory RAG

This sample application performs an in-memory RAG by dividing a Wikipedia article into chunks, getting embedding vectors for those chunks, and creating an appropriate prompt based on the cosine similarities.

```YAML
${packages/samples/graph_data/openai/wikipedia_rag.yaml}
```
