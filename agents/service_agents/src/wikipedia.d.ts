declare module "wikipedia" {
  const wiki: {
    setLang: (lang: string) => void;
    search: (query: string) => Promise<{ results: { title: string }[] }>;
    page: (title: string) => Promise<{
      summary: () => Promise<Record<string, unknown>>;
      content: () => Promise<string>;
    }>;
  };
  export default wiki;
}
