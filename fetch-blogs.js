const axios = require("axios");
const fs = require("mz/fs");
const path = require("path");

const S3_BASE_PATH =
  "https://s3.ap-northeast-2.amazonaws.com/ahnheejong.name-articles";

async function fetchIndex() {
  const indexReponse = await axios(`${S3_BASE_PATH}/index.json`, {
    responseType: "json"
  });
  return indexReponse.data;
}

async function makeFile({ slug, title, description, date, tags }) {
  const articleReponse = await axios(`${S3_BASE_PATH}/${slug}/article.md`);

  const filePath = path.join(__dirname, "src", "pages", "blog", `${slug}.md`);
  const fileContentArray = [
    "---",
    "templateKey: blog-post",
    `title: "${title}"`,
    `date: ${date}T09:00:00+09:00`,
    `description: "${description}"`,
    `tags:`,
    ...tags.map(tag => `  - ${tag}`),
    "---",
    articleReponse.data
  ];

  await fs.writeFile(filePath, fileContentArray.join("\n"));
}

async function main() {
  const index = await fetchIndex();
  index.forEach(makeFile);
}

main();
