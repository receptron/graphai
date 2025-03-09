import { defineLoader } from "vitepress";

// Topics related to GraphAI but not actual GraphAI articles to be excluded
const EXCLUDE_ARTICLES = [
  "https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk4",
  "https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk2"
]

type Article = {
  title: string;
  url: string;
  author: string;
  authorUrl: string;
  publishedAt: string;
};

const fetchZennTopicArticles = async (topicName: string): Promise<Article[]> => {
  try {
    const url = `https://zenn.dev/topics/${topicName}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);

    if (!nextDataMatch) {
      throw new Error("Could not find __NEXT_DATA__ script");
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const articlesData = nextData.props?.pageProps?.articles || [];

    const articles: Article[] = articlesData.map((article: any) => {
      const user = article.user || {};

      const authorUrl = `https://zenn.dev/${user.username}`;

      return {
        title: article.title,
        url: `https://zenn.dev${article.path}`,
        author: user.name,
        authorUrl,
        emoji: article.emoji,
        likedCount: article.likedCount,
        publishedAt: article.publishedAt,
      };
    }).filter((article: Article) => !EXCLUDE_ARTICLES.includes(article.url));

    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
};

export interface Data {
  articles: Article[];
}

declare const data: Data;
export { data };

export default defineLoader({
  async load(): Promise<Data> {
    return {
      articles: await fetchZennTopicArticles("graphai"),
    };
  },
});
