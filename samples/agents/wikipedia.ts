import { AgentFunction } from "@/graphai";
import wiki from "wikipedia";

export const wikipediaAgent: AgentFunction<{ inputKey: string; lang?: string, summary?: boolean }, Record<string, any> | undefined> = async ({ inputs, params }) => {
  const { inputKey, lang, summary } = params;
  const query = inputs[0][inputKey];
  try {
    if (lang) {
      wiki.setLang(lang);
    }
    const search = await wiki.search(query);
    const search_res = search.results[0];

    const page = await wiki.page(search_res["title"]);
    const content = await (summary ? page.summary() : page.content());
    return { content, ...search.results[0] };
  } catch (error) {
    console.log(error);
    //=> Typeof wikiError
  }
  return;
};
