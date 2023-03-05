const fs = require("fs");
const path = require("path");
const axios = require("axios");

const downloadFile = async (url, filePath) => {
  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });

    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filePath))
        .on("error", reject)
        .once("close", () => resolve(filePath));
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.downloadFile = downloadFile;
