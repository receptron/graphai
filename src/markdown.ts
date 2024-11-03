import { writeFileSync, readFileSync, existsSync } from "fs";

const readYaml = (filename: string) => {
  const path = __dirname + "/simple/" + filename;
  const yamlStr = readFileSync(path, "utf8");
  const graph = parse(yamlStr);
  return graph;
};

// "docs/Tutorial.template.md"
// "packages/graphai/README.md"

const rewrite = (fromFile: string, toFile: string) => {
  const templateFile = __dirname + "/../" + fromFile;
  const templateText = readFileSync(templateFile, "utf8");

  const regex = /\${([^}]+)}/g;
  const templateMatch = [...templateText.matchAll(regex)];
  const tags = Array.from(new Set(templateMatch.map((a) => a[1])));

  const files = {};
  tags.forEach((tag) => {
    if (existsSync(__dirname + "/../" + tag)) {
      files[tag] = readFileSync(__dirname + "/../" + tag, "utf8");
    }
  });
  const docText = Object.keys(files).reduce((tmp, tag) => {
    return tmp.replaceAll("${" + tag + "}", files[tag]);
  }, templateText);

  const writeFile = __dirname + "/../" + toFile;
  writeFileSync(writeFile, docText);
};

rewrite("docs/Tutorial.template.md", "docs/Tutorial.md");
rewrite("packages/graphai/README.template.md", "packages/graphai/README.md");
