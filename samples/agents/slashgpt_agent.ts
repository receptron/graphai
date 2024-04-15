import { AgentFunction } from "@/graphai";

export const slashGPTFuncitons2TextAgent: AgentFunction<
  { function_data_key: string; result_key: number },
  Record<string, string>,
  { function_data: { [key: string]: string[] } }
> = async (context) => {
  const { params } = context;
  const result = (context?.inputs[0].function_data[params.function_data_key] || []).map((r: any) => {
    const { title, description } = r;
    return ["title:", title, "description:", description].join("\n");
  });

  return { content: result[context.forkIndex ?? 0] };
};
