import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import {
  rssAgent,
} from "@/experimental_agents";

const graph_data = {
  version: 0.2,
  nodes: {
    rssFeed: {
      value: "https://www.theverge.com/apple/rss/index.xml",
    },
    fetcher: {
      agentId: "rssAgent",
      isResult: true,
      inputs: ["rssFeed"],
    },
  },
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, {
    rssAgent,
  }) as any;
  console.log(result.fetcher.feed.entry[0]);
};
if (process.argv[1] === __filename) {
  main();
}
