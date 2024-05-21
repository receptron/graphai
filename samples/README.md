# Samples


## Interview

Source Code: [Interview](./llm/interview.ts)

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

## Chat

Source Code: [Chat](./interaction/chat.ts)

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

1. **Initial Input:** The `source` node provides the initial data.
2. **Wikipedia Retrieval:** The `wikipedia` node retrieves content from Wikipedia using the name from the `source` node.
3. **Text Processing:** The content is split into chunks (`chunks`), and embeddings are generated for these chunks (`embeddings`). Simultaneously, an embedding for the topic is generated (`topicEmbedding`).
4. **Similarity Calculation:** The `similarityCheck` node calculates the similarity between the text chunks and the topic embedding.
5. **Sorting and Concatenation:** The text chunks are sorted based on similarity (`sortedChunks`), and the most relevant chunks are concatenated up to a token limit (`referenceText`).
6. **Prompt Generation:** A prompt is generated using the initial query and the reference text (`prompt`).
7. **LLM Query:** The `RagQuery` node sends the prompt to the LLM. Additionally, a one-shot query is performed using the initial query (`OneShotQuery`).

## Research

[Research](./llm/research.ts)

In this sample, a user inputs a topic, the system detects the language of the input, retrieves relevant information from Wikipedia, summarizes it, and then translates it if necessary.

1. **Input Capture**: The `topic` node prompts the user to input a topic.
2. **Language Detection**: The `detector` node identifies the language and translates the topic to English if necessary.
3. **Wikipedia Lookup**: The `wikipedia` node fetches and summarizes relevant information from Wikipedia.
4. **Translation**: The `translate` node ensures the summary is in the original language if it was not in English.
5. **Final Output**: The result from the `translate` node is the final output of the workflow.

## Reception

[Reception](./interaction/reception.ts)

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

## To be described

[Interview JP](./llm/interview_jp.ts)
[Review](./llm/review.ts)
[Meta Chat](./interaction/metachat.ts)
[Describe Graph](./llm/describe_graph.ts)
