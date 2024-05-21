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

[Interview JP](./llm/interview_jp.ts)
[Review](./llm/review.ts)
[Research](./llm/research.ts)
[Wikipedia](./embeddings/wikipedia.ts)
[Reception](./interaction/reception.ts)
[Meta Chat](./interaction/metachat.ts)
[Describe Graph](./llm/describe_graph.ts)
