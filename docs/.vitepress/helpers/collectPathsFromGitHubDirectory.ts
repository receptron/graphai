import { fetchGitHubApiJson, fetchGitHubApiText } from './fetchGitHubAPI';

export const collectPathsFromGitHubDirectory = async (dirPath: string) => {
  try {
    const directory = await fetchGitHubApiJson(`https://api.github.com${dirPath}`);

    const paths: { params: { name: string }; content: string }[] = [];

    for (const item of directory) {
      if (item.type === 'file' && item.name.endsWith('.md') && item.name !== 'README.md') {
        const content = await fetchGitHubApiText(item.download_url);
        const agentName = item.name.replace('.md', '');

        paths.push({
          params: { name: agentName },
          content: content
        });
      }
    }

    return paths;
  } catch (error) {
    console.error('Error fetching data from graphai-agents:', error);
    return [];
  }
}
