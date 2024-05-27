# Samples


## Interview

Source code: [Interview](./llm/interview.ts)

This sample graph was designed to simulate an interview with a famous person. The flow involves multiple agents working together to process user input, generate conversational context, and manage an iterative chat process.

1. The user is prompted to input the name of a famous person through the `name` node.
2. The `context` node generates the interview context using the input name.
3. The `messages` node initializes the conversation with system and greeting messages.
4. The `chat` node manages the conversation flow using a nested graph, iterating 6 times.
5. Within the nested graph:
   - The `groq` node generates a response from the model.
   - The `output` node formats the response and prints it to the console.
   - The `reducer` node appends the new message to the messages array.
   - The `swappedContext` node swaps the roles of interviewer and interviewee.
   - The `swappedMessages` node updates the messages for the next iteration.
6. The cycle repeats for 6 iterations, simulating a back-and-forth interview.

## Interview in Japanese

Source code: [Interview JP](./llm/interview_jp.ts)

1. The user inputs the name of the person to interview.
2. The context for the interview is generated.
3. Initial messages are set up.
4. The nested graph executes 6 iterations, simulating a back-and-forth interview:
   - The model generates a response.
   - The response is translated to Japanese.
   - The response is formatted and output.
   - The messages are updated with the new response.
   - The roles of interviewer and interviewee are swapped.
   - The context and messages are updated.
5. After the iterations, the final response is translated to Japanese and output.

## Chat

Source code: [Chat](./interaction/chat.ts)

This sample is an interactive chat loop, where the user can engage in a conversation with an AI model. The conversation continues in a loop until the user inputs "/bye".

1. The loop starts with `continue` set to `true`.
2. The `userInput` node prompts the user for input.
3. The `checkInput` node checks if the user input is "/bye". If it is, `continue` is set to `false`, breaking the loop.
4. The `userMessage` node formats the user input as a message.
5. The `appendedMessages` node appends the user message to the conversation history.
6. The `groq` node sends the updated conversation history to the AI model for a response.
7. The `output` node formats and displays the AI's response.
8. The `reducer` node appends the AI's response to the conversation history.
9. The loop repeats until the user inputs "/bye".

## In-memory RAG

Souce Code: [Wikipedia](./embeddings/wikipedia.ts)

This sample is a Retrieval-Augmented Generation (RAG) application using GraphAI. This graph is designed to query information about Sam Bankman-Fried's final court sentence, retrieve relevant data from Wikipedia, process it, and finally generate a response using a Large Language Model (LLM) such as GPT-3.5.

1. The `source` node provides the initial data.
2. The `wikipedia` node retrieves content from Wikipedia using the name from the `source` node.
3. The content is split into chunks (`chunks`), and embeddings are generated for these chunks (`embeddings`). Simultaneously, an embedding for the topic is generated (`topicEmbedding`).
4. The `similarityCheck` node calculates the similarity between the text chunks and the topic embedding.
5. The text chunks are sorted based on similarity (`sortedChunks`), and the most relevant chunks are concatenated up to a token limit (`referenceText`).
6. A prompt is generated using the initial query and the reference text (`prompt`).
7. The `RagQuery` node sends the prompt to the LLM. Additionally, a one-shot query is performed using the initial query (`OneShotQuery`).

## Research

Source code: [Research](./llm/research.ts)

In this sample, a user inputs a topic, the system detects the language of the input, retrieves relevant information from Wikipedia, summarizes it, and then translates it if necessary.

1. The `topic` node prompts the user to input a topic.
2. The `detector` node identifies the language and translates the topic to English if necessary.
3. The `wikipedia` node fetches and summarizes relevant information from Wikipedia.
4. The `translate` node ensures the summary is in the original language if it was not in English.
5. The result from the `translate` node is the final output of the workflow.

## Reception

Source code: [Reception](./interaction/reception.ts)

The goal of this application is to interactively gather specific information (name, date of birth, and gender) from a user through iterative conversations with a language model (LLM).

1. The `system message` provides instructions to the LLM on the information to collect.
2. The `userInput` node prompts the user for input.
3. The `userMessage` node formats the user input.
4. The `appendedMessages` node updates the conversation with the user’s message.
5. The `llm` node sends the conversation to the LLM for processing.
6. The `argumentsParser` node extracts information if the LLM calls the `report` function.
7. The `output` node displays the LLM’s response.
8. The `reducer` node updates the conversation with the LLM’s response.
9. The `continue` node checks if the loop should continue based on the LLM’s response.

## Generated Graph Example

Source code: [Meta Chat](./interaction/metachat.ts)

This sample aims to generate another GraphAI graph that collects user information (Name, Date of Birth, and Gender) using an LLM (GPT-4) and then executes the generated graph.

1. The `graphGenerator` node is essentially prompting the GPT-4 model to generate a GraphAI graph based on the provided documentation and instructions.
2. The `parser` node parses the JSON content generated by the GPT-4 model, which is the new GraphAI graph.
3. The `executer` node executes the newly generated GraphAI graph by nesting it within the current graph.

## Graph Description

Source code: [Describe Graph](./llm/describe_graph.ts)

1. The `describer` node asks the GPT-4 to generate the description of the specified graph.
2. The `description` node extract the description from the generated message.

## RSS Reader

Source code: [RSS Reader](./net/rss.ts)

This sample fetches and processes RSS feed data from a given URL, specifically from "https://www.theverge.com/microsoft/rss/index.xml". The flow extracts relevant content from the RSS feed, processes it through a series of agents, and translates the content into Japanese.

1. The `url` node provides the RSS feed URL.
2. The `rssFeed` node fetches the RSS feed data from the URL.
3. The `entries` node filters the fetched data to include only the required properties (`title`, `link`, `content`).
4. The `map` node processes each filtered entry concurrently (up to 4 entries), executing the nested graph for each entry:
   - The `template` node formats the entry's `title` and `content`.
   - The `query` node translates the formatted string into Japanese.
   - The `extractor` node outputs the translated content.

## Weather app

Source code: [Weather](./net/weather.ts)

THis sample simulates a conversation with a meteorologist. The system is capable of handling user inputs, querying a weather API, and managing the conversation iteratively based on user requests.

1. The loop starts with the `continue` node set to `true`.
2. The user is prompted to input a location.
3. The `checkInput` node determines if the user wants to continue or exit.
4. If the user input is valid, it is added to the conversation messages.
5. The `llmCall` node processes the messages and calls the LLM.
6. The `output` node prints the LLM's response if available.
7. If the LLM requests a tool call, the nested graph `tool_calls` handles the request.
8. The `reducer` node updates the conversation messages.
9. The loop continues until the user inputs "/bye".
