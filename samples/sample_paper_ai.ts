import path from "path";
import search from "arXiv-api-ts";

import { GraphAI, NodeExecute } from "@/graphai";
import { readGraphaiData } from "~/file_utils";
import { slashGPTAgent } from "./agents/slashgpt";

export const parrotingAgent: NodeExecute = async (context) => {
  return {};
};
export const search_arxiv_papers = async (keywords: string[], limit = 10) => {
  const includes = keywords.map((k) => {
    return { name: k };
  });
  const papers = await search({
    searchQueryParams: [
      {
        include: includes,
      },
    ],
    sortBy: "lastUpdatedDate",
    sortOrder: "descending",
    start: 0,
    maxResults: limit,
  });
  return papers.entries || [];
};

type arxivData = { id: string; title: string; summary: string };
const arxivAgent: NodeExecute<{ keywords: string[]; limit: number }, arxivData[]> = async (context) => {
  const { keywords, limit } = context.params;
  const arxivResult = await search_arxiv_papers(keywords, limit);
  // console.log("executing", arxivResult, context.params.keywords);

  const result = arxivResult.map((r: any) => {
    const { id, title, summary } = r;
    return { id, title, summary };
  });
  return result;
};
const arxiv2TextAgent: NodeExecute = async (context) => {
  const result = (context?.payload?.searchArxiv || [])
    .map((r: any) => {
      const { id, title, summary } = r;
      return ["id:", id, "title:", title, "summary:", summary].join("\n");
    })
    .join("\n\n\n");

  return result;
};
const runAgent = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, { default: parrotingAgent, arxivAgent: arxivAgent, arxiv2TextAgent, slashGPTAgent });
  const result = await graph.run();
  console.log(result);
};

const main = async () => {
  await runAgent("/graphs/arxiv.yml");
  console.log("COMPLETE 1");
};
main();
