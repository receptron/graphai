import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import {
  rssAgent, propertyFilterAgent,
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
        include: ["title"] // , "link", "content"],
      },
      inputs: ["rssFeed.feed.entry"]
    }
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, {
    rssAgent,
    propertyFilterAgent,
  }) as any;
  // console.log(result.rssFeed.feed.entry[0]);
  console.log(result.filter);
};
if (process.argv[1] === __filename) {
  main();
}
