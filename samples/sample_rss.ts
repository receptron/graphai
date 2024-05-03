import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import {
  rssAgent, 
  propertyFilterAgent,
  gloqAgent,
} from "@/experimental_agents";

const graph_data = {
  version: 0.2,
  nodes: {
    url: {
      value: "https://www.theverge.com/apple/rss/index.xml",
    },
    rssFeed: {
      agentId: "rssAgent",
      inputs: ["url"],
    },
    filter: {
      agentId: "propertyFilterAgent",
      isResult: true,
      params: {
        include: ["title", "link", "content"],
      },
      inputs: ["rssFeed.feed.entry.$1"]
    },
    query: {
      agentId: "gloqAgent",
      params: {
        model: "Llama3-70b-8192", // "mixtral-8x7b-32768",
        query: "次のHTMLからテキストだけを抜き出し、省略せずに、全文を日本語に翻訳して。余計なことは言わずに、翻訳した文章だけ答えて。",
      },
      isResult: true,
      inputs: ["filter.content._"],
    }
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, {
    rssAgent,
    propertyFilterAgent,
    gloqAgent
  }) as any;
  // console.log(result.rssFeed.feed.entry[0]);
  console.log(result.filter);
  console.log(result.query.choices);
};
if (process.argv[1] === __filename) {
  main();
}
