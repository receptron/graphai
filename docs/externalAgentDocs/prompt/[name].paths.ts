import { collectPathsFromGitHubDirectory } from "../../.vitepress/helpers/collectPathsFromGitHubDirectory";

const BASE_PATH = '/repos/receptron/graphai-agents/contents/docs/agentDocs/prompt';


export default {
  async paths() {
    return await collectPathsFromGitHubDirectory(BASE_PATH);
  }
}
