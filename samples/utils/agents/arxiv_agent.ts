import search from "arXiv-api-ts";

import { AgentFunction } from "@/graphai";

type arxivData = { id: string; title: string; summary: string };

const search_arxiv_papers = async (keywords: string[], limit = 10) => {
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

export const arxivAgent: AgentFunction<{ keywords: string[]; limit: number }, arxivData[]> = async (context) => {
  const { keywords, limit } = context.params;
  const arxivResult = await search_arxiv_papers(keywords, limit);
  // console.log("executing", arxivResult, context.params.keywords);

  const result = arxivResult.map((r: any) => {
    const { id, title, summary } = r;
    return { id, title, summary };
  });
  return result;
};

export const arxiv2TextAgent: AgentFunction<Record<string, unknown>, Record<string, unknown>, string[]> = async (context) => {
  const result = (context.inputs[0] || [])
    .map((r: any) => {
      const { id, title, summary } = r;
      return ["id:", id, "title:", title, "summary:", summary].join("\n");
    })
    .join("\n\n\n");
  return { content: result };
};
