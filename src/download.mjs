/*
 * Author: bjiang
 * Create Time: 2020/12/23 11:44
 */

import fs from "fs";
import https from "https";
import path from "path";

const prefix = "https://oni-db.com/";
const urls = fs.readFileSync("./files.txt", "utf-8").split("\r\n").filter(Boolean);
const agent = new https.Agent({
  keepAlive: true
});
const get = () => {
  urls.reduce((next, url, index) => next.then(() => new Promise((resolve, reject) => {
    const filename = path.join("../", url);
    console.info(`get ${index} ${url}`);
    if (fs.existsSync(filename)) resolve();
    https.get(`${prefix}/${url}`, { agent, timeout: 5000 }, (res) => {
      console.info(`get ${index} success`);
      res.on("end", resolve);
      res.pipe(fs.createWriteStream(filename));
    }).on("error", () => {
      console.info(`get ${index} filed`);
      resolve();
    });
  })), Promise.resolve()).then(() => {
    if (urls.filter((url) => !fs.existsSync(path.join("../", url))).length > 0) get();
  });
};

get();
