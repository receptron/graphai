import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";

// https://platform.openai.com/docs/guides/vision
const getImageUrl = (data: string, imageType: string, detail?: string) => {
  if (imageType === "http") {
    return {
      url: data,
    };
  }
  const dataUrl = `data:image/${imageType};base64,${data}`;
  return {
    url: dataUrl,
    detail: detail ?? "auto",
  };
};

type Content = { type: string; image_url: { url: string; detail?: string } } | { type: string; text: string };

export const images2messageAgent: AgentFunction<
  {
    imageType: string;
    detail?: string;
  },
  {
    message: {
      role: "user";
      content: Content[];
    };
  },
  {
    array: string[];
    prompt?: string;
  }
> = async ({ namedInputs, params }) => {
  const { imageType, detail } = params;
  const { array, prompt } = namedInputs;
  arrayValidate("images2messageAgent", namedInputs);
  assert(!!imageType, "images2messageAgent: params.imageType is UNDEFINED! Set Type: png, jpg...");

  const contents: Content[] = array.map((base64ImageData) => {
    const image_url = getImageUrl(base64ImageData, imageType, detail);
    return {
      type: "image_url",
      image_url,
    };
  });

  if (prompt) {
    contents.unshift({ type: "text", text: prompt });
  }

  return {
    message: {
      role: "user",
      content: contents,
    },
  };
};

const images2messageAgentInfo: AgentFunctionInfo = {
  name: "images2messageAgent",
  agent: images2messageAgent,
  mock: images2messageAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "An array of base64-encoded image data strings or image URLs. These will be converted into OpenAI Vision-compatible image message format.",
        items: {
          type: "string",
          description: "Base64 image string or HTTP URL depending on 'imageType'.",
        },
      },
      prompt: {
        type: "string",
        description: "Optional prompt text to include as the first message content before images.",
      },
    },
    required: ["array"],
    additionalProperties: false,
  },
  params: {
    type: "object",
    properties: {
      imageType: {
        type: "string",
        description: "The type of image input: 'png', 'jpg', etc. for base64, or 'http' for image URLs.",
      },
      detail: {
        type: "string",
        description: "The level of image detail requested by the model (e.g., 'auto', 'low', 'high'). Optional.",
      },
    },
    required: ["imageType"],
    additionalProperties: false,
  },
  output: {
    type: "object",
    properties: {
      message: {
        type: "object",
        description: "OpenAI-compatible chat message including images and optional prompt text.",
        properties: {
          role: {
            type: "string",
            enum: ["user"],
            description: "Message role, always 'user' for this agent.",
          },
          content: {
            type: "array",
            description: "The array of message content elements, including optional text and one or more images.",
            items: {
              type: "object",
              oneOf: [
                {
                  properties: {
                    type: {
                      type: "string",
                      const: "text",
                    },
                    text: {
                      type: "string",
                      description: "Prompt message text.",
                    },
                  },
                  required: ["type", "text"],
                  additionalProperties: false,
                },
                {
                  properties: {
                    type: {
                      type: "string",
                      const: "image_url",
                    },
                    image_url: {
                      type: "object",
                      properties: {
                        url: {
                          type: "string",
                          description: "URL or data URL of the image.",
                        },
                        detail: {
                          type: "string",
                          description: "Image detail level (e.g., 'high', 'low', 'auto'). Optional for base64.",
                        },
                      },
                      required: ["url"],
                      additionalProperties: false,
                    },
                  },
                  required: ["type", "image_url"],
                  additionalProperties: false,
                },
              ],
            },
          },
        },
        required: ["role", "content"],
        additionalProperties: false,
      },
    },
    required: ["message"],
    additionalProperties: false,
  },
  samples: [
    {
      inputs: { array: ["abcabc", "122123"] },
      params: { imageType: "png" },
      result: {
        message: {
          content: [
            {
              image_url: {
                detail: "auto",
                url: "data:image/png;base64,abcabc",
              },
              type: "image_url",
            },
            {
              image_url: {
                detail: "auto",
                url: "data:image/png;base64,122123",
              },
              type: "image_url",
            },
          ],
          role: "user",
        },
      },
    },
    {
      inputs: { array: ["abcabc", "122123"], prompt: "hello" },
      params: { imageType: "jpg", detail: "high" },
      result: {
        message: {
          content: [
            {
              type: "text",
              text: "hello",
            },
            {
              image_url: {
                detail: "high",
                url: "data:image/jpg;base64,abcabc",
              },
              type: "image_url",
            },
            {
              image_url: {
                detail: "high",
                url: "data:image/jpg;base64,122123",
              },
              type: "image_url",
            },
          ],
          role: "user",
        },
      },
    },
    {
      inputs: { array: ["http://example.com/1.jpg", "http://example.com/2.jpg"] },
      params: { imageType: "http" },
      result: {
        message: {
          content: [
            {
              image_url: {
                url: "http://example.com/1.jpg",
              },
              type: "image_url",
            },
            {
              image_url: {
                url: "http://example.com/2.jpg",
              },
              type: "image_url",
            },
          ],
          role: "user",
        },
      },
    },
  ],
  description: "Returns the message data for llm include image",
  category: ["image"],
  author: "Receptron team",
  repository: "https://github.com/snakajima/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/images_agents/image_to_message_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default images2messageAgentInfo;
