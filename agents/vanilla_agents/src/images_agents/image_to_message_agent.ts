import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import { arrayValidate } from "../array_agents/common";

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
  Array<never>,
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
        description: "the array of base64 image data",
      },
      prompt: {
        type: "string",
        description: "prompt message",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
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
  license: "MIT",
};
export default images2messageAgentInfo;
