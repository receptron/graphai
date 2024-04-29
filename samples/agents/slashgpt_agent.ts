import { AgentFunction } from "@/graphai";
import { ChatData } from "slashgpt";

export const slashGPTFuncitons2TextAgent: AgentFunction<{ function_data_key: string; result_key: number }, Record<string, string[]>, ChatData[]> = async ({
  params,
  inputs,
}) => {
  const message = inputs[0].find((m) => m.role === "function_result");
  if (!message) {
    return;
  }
  const result = (message.function_data[params.function_data_key] || []).map((r: any) => {
    const { title, description } = r;
    return ["title:", title, "description:", description].join("\n");
  });
  // console.log(result)
  console.log(result);
  return result;
};

/*
const slashGPTAgentMock : AgentFunction<
  { function_data_key: string; result_key: number },
  Record<string, string>,
  { function_data: { [key: string]: string[] } }
> = async (context) => {
  return { content: "test response" };
};
*/
const slashGPTAgentMock = slashGPTFuncitons2TextAgent;

const apiDoc = {
  inputs_example: [
    {
      role: "function_result",
      content: "",
      name: "",
      preset: false,
      function_data: {
        methods: [
          {
            title: "Renewable Energy",
            description:
              "Promote the use of renewable energy sources like solar, wind, and hydro power to reduce dependence on fossil fuels and decrease CO2 emissions.",
          },
          {
            title: "Energy Efficiency",
            description: "Improve energy efficiency in industries, buildings, and transportation to reduce energy consumption and lower CO2 emissions.",
          },
        ],
      },
    },
  ],
  response_example: { content: "test response" },
};

export const slashGPTFuncitons2TextAgentInfo = {
  name: "slashGPTFuncitons2TextAgent",
  agent: slashGPTFuncitons2TextAgent,
  mock: slashGPTAgentMock,
  doc: apiDoc,
  // validateRule,
};
export default slashGPTFuncitons2TextAgentInfo;
