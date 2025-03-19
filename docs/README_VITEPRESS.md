# GraphAI Website

This is the official documentation for [GraphAI](https://github.com/receptron/graphai).

## Development

### Local Development Setup

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

The site will be available at `http://localhost:5174`.


### How to Add Translation

1. Directory structure
```
docs/
├── guide/
|   └── example.md        # English version
├── ja/
│   └── guide/
│       └── example.md    # Japanese version
```

2. Create translation files
   - Create files with the same name in the `ja/` directory
   - Maintain the same file structure and frontmatter while translating content

3. Configure Sidebar
   - Edit `docs/.vitepress/config.mts` to add the translated pages
   - Add entries under both default and Japanese locales:

```typescript
export default defineConfig({
  themeConfig: {
    // ...
    nav: [
      // Default (English) navigation
      { text: "Guide", link: "/ja/guide/tutorial" },
      // ...
    ],
    sidebar: {
      // Default (English) sidebar
      "/guide/": [
        {
          text: "Tutorial",
          link: "/guide/tutorial",
        },
        // ...
      ],
      // ...
    },
  },
  // ...
  locales: {
    // ...
    ja: {
      // ...
      themeConfig: {
        // Japanese navigation
        nav: [
          { text: "Guide", link: "/ja/guide/tutorial" },
          // ...
        ],
        sidebar: {
          // Japanese sidebar
          "/ja/guide/": [
            {
              text: "Tutorial",
              link: "/ja/guide/tutorial",
            },
          ],
          // ...
        },
      },
    },
  },
});
```

4. Important Notes for Sidebar Configuration
   - Keep the same structure between languages
   - Use corresponding paths (`/guide/` for English, `/ja/guide/` for Japanese)
   - Translate both the navigation text and page titles
   - Maintain consistent link paths that match your file structure

## Deploy

1. Deploy to Firebase Hosting:

```bash
# After authenticating with Firebase
yarn deploy
```

## Config

### Show Case Community Articles

.vitepress/theme/components/CommunityArticles/article.data.mts
