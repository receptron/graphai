import "dotenv/config";

import { main as wikipedia } from "./embeddings/wikipedia";

import { main as groq } from "./llm/groq";
import { main as claude } from "./llm/claude";
import { main as gpt4o } from "./llm/gpt4o";
import { main as interview_jp } from "./llm/interview_jp";
import { main as interview } from "./llm/interview";
import { main as interview_ollama } from "./llm/interview_ollama";
import { main as interview_phi3 } from "./llm/interview_phi3";
import { main as research } from "./llm/review";
import { main as rewrite } from "./llm/rewrite";
import { main as describe_graph } from "./llm/describe_graph";
import { main as gemini } from "./llm/gemini";

import { main as net_rss } from "./net/rss";
import { main as weather } from "./net/weather";

import { main as interaction_text } from "./interaction/text";
import { main as interaction_chat } from "./interaction/chat";
import { main as interaction_chat_gemini } from "./interaction/chat_gemini";
import { main as interaction_metachat } from "./interaction/metachat";
import { main as interaction_metachat_gemini } from "./interaction/metachat_gemini";
import { main as interaction_reception } from "./interaction/reception";
import { main as interaction_reception_gemini } from "./interaction/reception_gemini";
import { main as interaction_wikipedia } from "./interaction/wikipedia";

const main = async () => {
  // llm
  await groq();
  await claude();
  await gpt4o();
  await interview_jp();
  await interview();
  await interview_ollama();
  await interview_phi3();
  await research();
  await rewrite();
  await describe_graph();
  await gemini();

  // interaction
  await interaction_text();
  await interaction_chat();
  await interaction_chat_gemini();
  await interaction_metachat();
  await interaction_metachat_gemini();
  await interaction_reception();
  await interaction_reception_gemini();
  await interaction_wikipedia();
};

main();
