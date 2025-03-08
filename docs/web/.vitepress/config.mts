import { defineConfig } from "vitepress";
import { generateAgentsSidebar, generateApiDocSidebar } from "./helpers/generateSidebar";

// TODO: change to the actual domain
const HOST_NAME = "https://graphai-web.web.app";

const agentsSidebar = generateAgentsSidebar();
const apiDocSidebar = generateApiDocSidebar();

export default defineConfig({
  title: "GraphAI - Declarative AI Workflow Engine",
  description: "GraphAI is an asynchronous data flow execution engine for building agentic applications using declarative data flow graphs.",
  lastUpdated: true,
  ignoreDeadLinks: true,
  titleTemplate: ":title - GraphAI",
  srcDir: "../",
  sitemap: {
    hostname: HOST_NAME,
  },
  head: [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en" }],
    ["meta", { property: "og:title", content: "GraphAI" }],
    ["meta", { property: "og:site_name", content: "GraphAI" }],
    ["meta", { property: "og:image", content: `${HOST_NAME}/images/og-image.png` }],
    ["meta", { property: "og:url", content: `${HOST_NAME}/` }],
    [
      "meta",
      {
        property: "og:description",
        content: "GraphAI is an asynchronous data flow execution engine for building agentic applications using declarative data flow graphs.",
      },
    ],
    ["link", { rel: "icon", type: "image/png", href: "/favicon/favicon-96x96.png", sizes: "96x96" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" }],
    ["link", { rel: "shortcut icon", href: "/favicon/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/favicon/site.webmanifest" }],
  ],
  srcExclude: [
    // link to other docs
    "./Async.md",
    "./Streaming.md",
    "./Paper.md",
    "./inputs.md",
    "./Tutorial.md",
    // non document
    "**/README.md",
    "./Tutorial.template.md",
    "./document_generation.md",
  ],

  themeConfig: {
    siteTitle: "GraphAI",
    logo: "/images/logo.png",
    nav: [
      { text: "Guide", link: "/guide/tutorial" },
      { text: "Agents", link: agentsSidebar[0].items[0].items[0].link },
      { text: "API Docs", link: apiDocSidebar[0].items[0].items[0].link },
      { text: "Showcase", link: "/showcase" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Tutorial",
          link: "/guide/tutorial",
        },
        {
          text: "Inputs",
          link: "/guide/inputs",
        },
        {
          text: "Async",
          link: "/guide/Async",
        },
        {
          text: "Streaming",
          link: "/guide/Streaming",
        },
        {
          text: "Papers",
          link: "/guide/Paper",
        },
      ],
      "/agentDocs/": agentsSidebar,
      "/apiDocMd/": apiDocSidebar,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/receptron/graphai" }],
    editLink: {
      pattern: "https://github.com/receptron/graphai/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    footer: {
      message: "Released under the MIT License.",
    },
  },

  locales: {
    root: {
      label: "English",
      lang: "en-US",
    },
    ja: {
      label: "Japanese",
      lang: "ja-JP",
      link: "/ja/",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/ja/guide/tutorial" },
          { text: "Showcase", link: "/ja/showcase" },
        ],
        sidebar: {
          "/ja/guide/": [
            {
              text: "Tutorial",
              link: "/ja/guide/tutorial",
            },
          ],
        },
        editLink: {
          pattern: "https://github.com/receptron/graphai/edit/main/docs/:path",
          text: "GitHubで編集",
        },
      },
    },
  },
});
