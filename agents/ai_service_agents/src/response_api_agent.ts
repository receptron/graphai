import { AgentFunctionInfo } from "@graphai/agent_utils";

interface ResponseApiAgentInputs {
  query: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ResponseApiAgentOutputs {
  response: string;
  metadata: {
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    response_id: string;
  };
}

interface ResponseApiAgentParams {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  debug?: boolean;
}

const responseApiAgent: AgentFunctionInfo<
  ResponseApiAgentInputs,
  ResponseApiAgentOutputs,
  ResponseApiAgentParams
> = {
  name: "responseApiAgent",
  description: "Agent for interacting with Response API to get AI-generated responses",
  inputs: {
    query: {
      type: "string",
      description: "The query or prompt to send to the Response API",
    },
    apiKey: {
      type: "string",
      description: "API key for Response API authentication (optional if provided in params)",
      optional: true,
    },
    model: {
      type: "string",
      description: "Model to use for the response (optional if provided in params)",
      optional: true,
    },
    temperature: {
      type: "number",
      description: "Temperature parameter for response generation (optional if provided in params)",
      optional: true,
    },
    maxTokens: {
      type: "number",
      description: "Maximum tokens for the response (optional if provided in params)",
      optional: true,
    },
  },
  params: {
    apiKey: {
      type: "string",
      description: "API key for Response API authentication",
      optional: true,
    },
    model: {
      type: "string",
      description: "Model to use for the response",
      optional: true,
      default: "gpt-4",
    },
    temperature: {
      type: "number",
      description: "Temperature parameter for response generation",
      optional: true,
      default: 0.7,
    },
    maxTokens: {
      type: "number",
      description: "Maximum tokens for the response",
      optional: true,
      default: 1000,
    },
    debug: {
      type: "boolean",
      description: "Enable debug mode to log API requests and responses",
      optional: true,
      default: false,
    },
  },
  outputs: {
    response: {
      type: "string",
      description: "The generated response from the API",
    },
    metadata: {
      type: "object",
      description: "Metadata about the response including model, usage statistics, and response ID",
    },
  },
  async execute({ inputs, params, debug }) {
    try {
      // Get API key from inputs or params or environment variable
      const apiKey = inputs.apiKey || params.apiKey || process.env.RESPONSE_API_KEY;
      if (!apiKey) {
        throw new Error("API key is required. Provide it in inputs, params, or as RESPONSE_API_KEY environment variable.");
      }

      // Get other parameters with fallbacks
      const model = inputs.model || params.model || "gpt-4";
      const temperature = inputs.temperature || params.temperature || 0.7;
      const maxTokens = inputs.maxTokens || params.maxTokens || 1000;
      const query = inputs.query;

      if (!query) {
        throw new Error("Query is required");
      }

      // Log debug information if debug mode is enabled
      if (params.debug) {
        debug.log("Response API Request:", {
          model,
          temperature,
          maxTokens,
          query: query.substring(0, 100) + (query.length > 100 ? "..." : ""),
        });
      }

      // Prepare request to Response API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: query,
            },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Response API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Log debug information if debug mode is enabled
      if (params.debug) {
        debug.log("Response API Response:", {
          status: response.status,
          model: data.model,
          usage: data.usage,
        });
      }

      // Extract and return the response and metadata
      return {
        response: data.choices[0].message.content,
        metadata: {
          model: data.model,
          usage: data.usage,
          response_id: data.id,
        },
      };
    } catch (error) {
      debug.error("Response API Error:", error);
      throw error;
    }
  },
  samples: [
    {
      name: "Basic query",
      inputs: {
        query: "What is the capital of France?",
      },
      params: {
        apiKey: "YOUR_API_KEY",
      },
    },
    {
      name: "Custom model and parameters",
      inputs: {
        query: "Write a short poem about artificial intelligence.",
      },
      params: {
        apiKey: "YOUR_API_KEY",
        model: "gpt-4",
        temperature: 0.9,
        maxTokens: 500,
      },
    },
  ],
};

export default responseApiAgent;
