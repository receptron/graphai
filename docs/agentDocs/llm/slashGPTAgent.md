## slashGPTAgent

### Description

Slash GPT Agent

### Schema

#### inputs

```json

{
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
    "required": [],
    "properties": {}
  }
}

````

### Input Format

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.role",
  ":agentId.$0.content",
  ":agentId.$0.preset",
  ":agentId.$1",
  ":agentId.$1.role",
  ":agentId.$1.content",
  ":agentId.$1.preset"
]

````

### Samples

#### inputs

```json

[]

````

#### params

```json

{"query":"Come up with ten business ideas for AI startup"}

````

#### result

```json

[
  {
    "role": "user",
    "content": "Come up with ten business ideas for AI startup",
    "preset": false
  },
  {
    "role": "assistant",
    "content": "1. AI-powered personal shopping assistant that helps users find clothes that fit their style and budget.\n2. AI-powered health monitoring system that analyzes user data to provide personalized healthcare recommendations.\n3. AI-powered chatbot for customer service that can handle a variety of queries and provide quick responses.\n4. AI-powered virtual personal trainer that creates customized workout plans based on user goals and progress.\n5. AI-powered language translation service that can accurately translate text and voice in real-time.\n6. AI-powered financial advisor that analyzes user spending habits and offers personalized advice for saving and investing.\n7. AI-powered content creation platform that uses algorithms to generate engaging articles, videos, and social media posts.\n8. AI-powered job matching platform that connects job seekers with relevant opportunities based on their skills and experience.\n9. AI-powered cybersecurity solution that continuously monitors and protects against online threats and data breaches.\n10. AI-powered educational platform that uses personalized learning algorithms to help students improve their skills and knowledge in various subjects.",
    "preset": false
  }
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

