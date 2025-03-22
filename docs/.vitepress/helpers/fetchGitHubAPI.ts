const fetchGitHubApi = async (path: string, isJson = true) => {
  if (!process.env.GITHUB_API_TOKEN && process.env.NODE_ENV !== 'production') {
    // skip github api call in development mode when GITHUB_API_TOKEN is not set
    return [];
  }
  if (!process.env.GITHUB_API_TOKEN) {
    throw new Error('GITHUB_API_TOKEN is not set. please set it in environment variables.');
  }

  const response = await fetch(path, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return isJson ? await response.json() : await response.text();
}

export const fetchGitHubApiJson = async (path: string) => {
  return await fetchGitHubApi(path, true);
}

export const fetchGitHubApiText = async (path: string) => {
  return await fetchGitHubApi(path, false);
}
