require("dotenv").config();

const { downloadFile } = require("./downloadFile");
const fs = require("mz/fs");
const path = require("path");
const Airtable = require("airtable");

const BLOG_BASE_ID = "appewtrDVqhNDYURy";
const QUOTE_TABLE_ID = "Quote";
const REVIEW_TABLE_ID = "Review";

const DATA_LIB_BASEPATH = path.join(__dirname, "..", "data");
const ASSET_BASEPATH = path.join(__dirname, "..", "static", "assets");

function init() {
  Airtable.configure({ apiKey: process.env.AIRTABLE_TOKEN });
  return new Airtable().base(BLOG_BASE_ID);
}

async function writeReviewFile({
  name,
  type,
  slug,
  stars,
  link,
  title,
  notes,
  image,
  finished_date,
}) {
  const markdownFilePath = path.join(
    DATA_LIB_BASEPATH,
    "review",
    type.toLowerCase(),
    `${slug}.md`
  );

  const imagePath = path.join("review", type.toLowerCase(), `${slug}.jpg`); // FIXME: 확장자 파일에서 추출해서 사용

  const imageFilePath = path.join(ASSET_BASEPATH, imagePath);

  const fileContentArray = [
    "---",
    "templateKey: review",
    `type: "${type}"`,
    `name: "${name}"`,
    `title: "${title}"`,
    `date: "${finished_date}"`,
    `stars: ${stars}`,
    `link: "${link}"`,
    `image: "/assets/${imagePath}"`,
    "---",
    notes,
  ];

  return await Promise.all([
    fs.writeFile(markdownFilePath, fileContentArray.join("\n")),
    downloadFile(image[0].url, imageFilePath),
  ]);
}

async function fetchAllRecordsForTable(base, tableId) {
  const rows = await base(tableId)
    .select()
    .all();

  return rows.map((row) => row.fields);
}

async function main() {
  const base = init();
  const [reviews, quotes] = await Promise.all([
    fetchAllRecordsForTable(base, REVIEW_TABLE_ID),
    fetchAllRecordsForTable(base, QUOTE_TABLE_ID),
  ]);

  //   console.log({ reviews, quotes });

  return Promise.all([
    Promise.all(
      reviews.filter((review) => review.slug != null).map(writeReviewFile)
    ),
  ]);
}

main();
