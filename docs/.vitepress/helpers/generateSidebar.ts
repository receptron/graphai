import path from "path";
import fs from "fs";
import { fetchGitHubApiJson } from "./fetchGitHubAPI";
[]
// Function to generate a title from a filename
const generateTitleFromFilename = (filename: string): string => {
  const basename = path.basename(filename, ".md").replace(/[-_]/g, " ");
  return basename;
};

export const generateSidebar = (dirRelativePath: string, sidebarTitle: string) => {
  const targetDir = path.resolve(__dirname, `../../${dirRelativePath}`);
  const categories = new Map();

  // Scan all folders in the directory
  const dirItems = fs.readdirSync(targetDir);
  const directories: string[] = [];
  const rootFiles: string[] = [];

  // Classify items into directories and files
  dirItems.forEach((item) => {
    const itemPath = path.join(targetDir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory() && !item.startsWith(".")) {
      directories.push(item);
    } else if (stats.isFile() && item.endsWith(".md") && item !== "index.md") {
      rootFiles.push(item);
    }
  });

  // Process as usual if subdirectories exist
  if (directories.length > 0) {
    directories.forEach((dir) => {
      const categoryName = generateTitleFromFilename(dir);
      categories.set(categoryName, []);
    });

    for (const [categoryName, items] of categories.entries()) {
      const categoryDirPath = path.join(targetDir, categoryName.toLowerCase().replace(/ /g, "-"));
      const categoryFiles = fs.readdirSync(categoryDirPath);

      categoryFiles.forEach((file) => {
        if (file.endsWith(".md") && file !== "index.md") {
          const filePath = path.join(categoryDirPath, file);
          const isFile = fs.statSync(filePath).isFile();

          if (isFile) {
            const itemName = generateTitleFromFilename(file);
            const itemLink = `/${dirRelativePath}/${categoryName.toLowerCase().replace(/ /g, "-")}/${path.basename(file, ".md")}`;

            items.push({
              text: itemName,
              link: itemLink,
            });
          }
        }
      });
    }
  }

  // Generate sidebar structure
  const sidebarItems = [
    {
      text: sidebarTitle,
      items: [] as any[],
    },
  ];

  // Add categories if subdirectories exist
  for (const [category, items] of categories.entries()) {
    // Do not add empty categories
    if (items.length > 0) {
      sidebarItems[0].items.push({
        text: category,
        collapsed: true,
        items: items,
      });
    }
  }

  // Directly add root directory files if no subdirectories exist
  if (rootFiles.length > 0) {
    if (directories.length === 0) {
      rootFiles.forEach((file) => {
        const itemName = generateTitleFromFilename(file);
        const itemLink = `/${dirRelativePath}/${path.basename(file, ".md")}`;

        sidebarItems[0].items.push({
          text: itemName,
          link: itemLink,
        });
      });
    } else {
      // Add as "Others" category if subdirectories exist
      const otherItems = rootFiles.map((file) => {
        const itemName = generateTitleFromFilename(file);
        const itemLink = `/${dirRelativePath}/${path.basename(file, ".md")}`;

        return {
          text: itemName,
          link: itemLink,
        };
      });

      if (otherItems.length > 0) {
        sidebarItems[0].items.push({
          text: "Others",
          collapsed: true,
          items: otherItems,
        });
      }
    }
  }

  return sidebarItems;
};

export const generateAgentsSidebar = () => {
  return generateSidebar("agentDocs", "Built-in Agents");
};

export const generateApiDocSidebar = () => {
  return generateSidebar("apiDocMd", "API Docs");
};

type SidebarItemChild = {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItemChild[];
};

type SidebarItem = {
  text: string;
  items: SidebarItemChild[];
};

export const generateExternalAgentsSidebar = async () => {
  const BASE_PATH = 'docs/agentDocs';

  async function fetchDirectoryContents(path: string) {
    const url = `https://api.github.com/repos/receptron/graphai-agents/contents/${path}`;
    return await fetchGitHubApiJson(url);
  }

  const topDirectories = await fetchDirectoryContents(BASE_PATH);

  const sidebarItems: SidebarItem[] = [{
    text: 'External Agent Docs',
    items: [],
  }];

  for (const item of topDirectories) {
    if (item.type === 'dir') {
      const dirContents = await fetchDirectoryContents(`${BASE_PATH}/${item.name}`);

      const categoryItems: SidebarItemChild = {
        text: generateTitleFromFilename(item.name),
        collapsed: true,
        items: [],
      };

      const mdFiles = dirContents.filter((file: {
        type: string;
        name: string;
      }) => file.type === 'file' && file.name.endsWith('.md'));

      for (const mdFile of mdFiles) {
        const itemName = generateTitleFromFilename(mdFile.name);
        const itemLink = `/externalAgentDocs/${item.name}/${mdFile.name}`;

        if (categoryItems.items) {
          categoryItems.items.push({
            text: itemName,
            link: itemLink,
          });
        }
      }

      sidebarItems[0].items.push(categoryItems);
    }
  }
  return sidebarItems;
}
